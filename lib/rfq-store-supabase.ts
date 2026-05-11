/**
 * Supabase-backed RFQ lead store.
 *
 * This module is the production persistence layer for the demande-de-devis
 * pipeline. It mirrors the API of `lib/rfq-store.ts` (file-JSON store) so
 * the rest of the application — API routes, CEO console — can keep its
 * current call shape unchanged.
 *
 * Why Supabase
 * ------------
 * Vercel serverless functions get a fresh, ephemeral filesystem on every
 * cold start, so the previous `data/rfq-leads.json` store loses every
 * lead the moment the function is recycled. The CEO console reported an
 * empty pipeline even after a buyer submitted the public form, because
 * the read happened on a different lambda instance than the write.
 *
 * Supabase Postgres is free up to 500 MB / 50k MAU, never sleeps after
 * the first request, and is the same stack the user already operates on
 * other projects (`webisafe` and the MasterXS playbook).
 *
 * Why no @supabase/supabase-js dependency
 * --------------------------------------
 * The official Node client is a wrapper around Supabase's PostgREST
 * endpoint. We talk PostgREST directly via `fetch` so we don't add
 * another dependency to install on every Vercel build, don't risk
 * version drift between the client lib and the server's API, and don't
 * pull in extra ESM resolution surprises. The set of operations we
 * actually need (insert, list, update one) is trivial to express as
 * plain HTTP calls.
 *
 * Security
 * --------
 * The `SUPABASE_SERVICE_ROLE_KEY` env var bypasses row-level security.
 * It MUST be set on the server side only (Vercel server env, .env.local).
 * It must NEVER be sent to the browser. This file is server-only by
 * design (uses Node-only APIs in callers and has no client export).
 *
 * Environment variables (set on Vercel and locally in `.env.local`):
 *   - SUPABASE_URL                 e.g. https://xyz.supabase.co
 *   - SUPABASE_SERVICE_ROLE_KEY    service-role secret (never public)
 *
 * The table schema is created by `supabase/migrations/0001_rfq_leads.sql`.
 */

import "server-only";
import {
  RFQ_STATUSES,
  type RfqInput,
  type RfqLead,
  type RfqStatus,
} from "./rfq-types";

/** Snake-cased row shape exactly as PostgREST returns it. */
interface RfqRow {
  id: string;
  reference: string;
  status: RfqStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  company: string;
  country: string;
  volume: string | null;
  port: string | null;
  message: string | null;
}

const SUPABASE_TABLE = "rfq_leads";

/**
 * Returns the configured Supabase HTTP base + headers, or `null` if
 * the environment variables are not set. Callers use this to decide
 * whether to delegate to Supabase or fall back to the local JSON store.
 */
export function getSupabaseConfig(): {
  url: string;
  headers: Record<string, string>;
} | null {
  const url = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return null;
  return {
    url,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/* ----------------------------------------------------------- mapping */

function rowToLead(row: RfqRow): RfqLead {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    email: row.email,
    company: row.company,
    country: row.country,
    volume: row.volume ?? "",
    port: row.port ?? "",
    message: row.message ?? "",
  };
}

function newReference(): string {
  return `RFQ-${Date.now().toString(36).toUpperCase()}`;
}

/* ------------------------------------------------------------- API */

export async function listLeadsSupabase(): Promise<RfqLead[]> {
  const cfg = requireConfig();
  const res = await fetch(
    `${cfg.url}/rest/v1/${SUPABASE_TABLE}?select=*&order=created_at.desc`,
    {
      method: "GET",
      headers: cfg.headers,
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(
      `Supabase list failed: ${res.status} ${await safeText(res)}`
    );
  }
  const rows = (await res.json()) as RfqRow[];
  return rows.map(rowToLead);
}

export async function createLeadSupabase(input: RfqInput): Promise<RfqLead> {
  const cfg = requireConfig();
  const now = new Date().toISOString();
  const payload = {
    reference: newReference(),
    status: "new" as RfqStatus,
    notes: "",
    created_at: now,
    updated_at: now,
    name: input.name,
    email: input.email,
    company: input.company,
    country: input.country,
    volume: input.volume || null,
    port: input.port || null,
    message: input.message || null,
  };

  const res = await fetch(`${cfg.url}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: {
      ...cfg.headers,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(
      `Supabase insert failed: ${res.status} ${await safeText(res)}`
    );
  }
  const rows = (await res.json()) as RfqRow[];
  const row = rows[0];
  if (!row) throw new Error("Supabase insert returned no row");
  return rowToLead(row);
}

export async function updateLeadSupabase(
  id: string,
  patch: Partial<Pick<RfqLead, "status" | "notes">>
): Promise<RfqLead | null> {
  const cfg = requireConfig();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.status && RFQ_STATUSES.includes(patch.status)) {
    updates.status = patch.status;
  }
  if (typeof patch.notes === "string") {
    updates.notes = patch.notes.slice(0, 4000);
  }

  const res = await fetch(
    `${cfg.url}/rest/v1/${SUPABASE_TABLE}?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        ...cfg.headers,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    }
  );
  if (!res.ok) {
    throw new Error(
      `Supabase update failed: ${res.status} ${await safeText(res)}`
    );
  }
  const rows = (await res.json()) as RfqRow[];
  const row = rows[0];
  return row ? rowToLead(row) : null;
}

export async function countLeadsByStatusSupabase(): Promise<
  Record<RfqStatus, number>
> {
  const leads = await listLeadsSupabase();
  const counts: Record<RfqStatus, number> = {
    new: 0,
    in_progress: 0,
    closed_won: 0,
    closed_lost: 0,
  };
  for (const l of leads) counts[l.status] = (counts[l.status] ?? 0) + 1;
  return counts;
}

/* --------------------------------------------------------- helpers */

function requireConfig() {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    throw new Error(
      "Supabase RFQ store called without SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return cfg;
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 400);
  } catch {
    return "<no-body>";
  }
}
