/**
 * Supabase-backed CEO console settings store.
 *
 * This module is the production persistence layer for the
 * `/console/settings` page. It mirrors the API of the legacy file-JSON
 * store (`lib/settings-store.ts`) so the rest of the app — the
 * `/console/settings` form, the readiness widget on `/console`, the
 * Buyer Pack PDF generator — can keep its current call shape unchanged.
 *
 * Why Supabase
 * ------------
 * Vercel serverless functions get a fresh, ephemeral, read-only
 * filesystem on every cold start (only `/tmp` is writable, and even
 * `/tmp` is not shared between invocations). The previous
 * `data/settings.json` writes therefore either failed silently with
 * EROFS or were wiped on the next cold start — which is exactly the
 * "Enregistrer ne marche pas" symptom seen on production. Supabase
 * Postgres is the same backend already used for the RFQ leads pipeline,
 * so the migration is zero-friction.
 *
 * Storage shape
 * -------------
 * The console-settings object is a singleton (one row, one project).
 * Modeling it as a many-column table would force a migration every
 * time we add a new readiness flag or contact field. Instead we use a
 * tiny key-value table with one JSONB column and a fixed string key
 * (`'console_settings'`). The whole `ConsoleSettings` object is
 * serialized into `data` on every write. This keeps the schema stable
 * across product iterations and matches how `lib/settings-store.ts`
 * already serializes/deserializes the object on the filesystem.
 *
 * Security
 * --------
 * The `SUPABASE_SERVICE_ROLE_KEY` env var bypasses row-level security.
 * It MUST be set on the server side only (Vercel server env,
 * `.env.local`). It must NEVER be sent to the browser. This file is
 * server-only by design.
 *
 * Environment variables (set on Vercel and locally in `.env.local`):
 *   - SUPABASE_URL                 e.g. https://xyz.supabase.co
 *   - SUPABASE_SERVICE_ROLE_KEY    service-role secret (never public)
 *
 * The table schema is created by `supabase/migrations/0002_console_settings.sql`.
 */

import "server-only";
import type { ConsoleSettings } from "./settings-store-types";

const SUPABASE_TABLE = "console_settings_kv";
const SINGLETON_KEY = "console_settings";

interface SettingsRow {
  key: string;
  data: ConsoleSettings;
  updated_at: string;
}

/**
 * Returns the configured Supabase HTTP base + headers, or `null` if
 * the environment variables are not set. Callers use this to decide
 * whether to delegate to Supabase or fall back to the local JSON store.
 */
export function getSupabaseSettingsConfig(): {
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

export function isSupabaseSettingsConfigured(): boolean {
  return getSupabaseSettingsConfig() !== null;
}

/* --------------------------------------------------------------- API --- */

/**
 * Returns the singleton settings row, or `null` if no row exists yet
 * (fresh Supabase project, before the first save). Callers should
 * fall back to defaults in that case — same behavior as the file store
 * when `data/settings.json` does not exist.
 */
export async function readSettingsSupabase(): Promise<ConsoleSettings | null> {
  const cfg = requireConfig();
  const res = await fetch(
    `${cfg.url}/rest/v1/${SUPABASE_TABLE}?select=*&key=eq.${encodeURIComponent(
      SINGLETON_KEY
    )}&limit=1`,
    {
      method: "GET",
      headers: cfg.headers,
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error(
      `Supabase settings read failed: ${res.status} ${await safeText(res)}`
    );
  }
  const rows = (await res.json()) as SettingsRow[];
  if (!rows.length) return null;
  return rows[0].data;
}

/**
 * Upsert the singleton settings row with the provided full snapshot.
 * The caller is responsible for merging partial patches with the
 * current row (see `lib/settings-store.ts → writeSettings`).
 */
export async function writeSettingsSupabase(
  next: ConsoleSettings
): Promise<ConsoleSettings> {
  const cfg = requireConfig();
  const payload = {
    key: SINGLETON_KEY,
    data: next,
    updated_at: new Date().toISOString(),
  };

  // PostgREST upsert: resolve conflict on the primary key (`key`).
  const res = await fetch(
    `${cfg.url}/rest/v1/${SUPABASE_TABLE}?on_conflict=key`,
    {
      method: "POST",
      headers: {
        ...cfg.headers,
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    throw new Error(
      `Supabase settings upsert failed: ${res.status} ${await safeText(res)}`
    );
  }
  const rows = (await res.json()) as SettingsRow[];
  const row = rows[0];
  if (!row) throw new Error("Supabase settings upsert returned no row");
  return row.data;
}

/* ------------------------------------------------------------- helpers */

function requireConfig() {
  const cfg = getSupabaseSettingsConfig();
  if (!cfg) {
    throw new Error(
      "Supabase settings store called without SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
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
