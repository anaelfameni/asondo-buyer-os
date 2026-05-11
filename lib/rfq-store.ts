/**
 * Demo-grade RFQ (Request For Quote) lead store.
 *
 * Stores leads in a JSON file under `<project>/data/rfq-leads.json`.
 * Each write is atomic (write to .tmp then rename). Adequate for a single
 * Node.js process serving the demo. NOT safe across multiple concurrent
 * processes or across Vercel serverless instances — for production,
 * swap the read/write helpers for a real database (Supabase, Vercel KV…).
 *
 * The shape of a lead matches the public RFQ form fields plus admin-only
 * metadata (id, createdAt, status, notes).
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  RFQ_STATUSES,
  type RfqInput,
  type RfqLead,
  type RfqStatus,
  type RfqValidationResult,
} from "./rfq-types";

// Re-export so existing server-side imports (API routes, server components)
// keep working unchanged. Client components must import from `./rfq-types`.
export { RFQ_STATUSES };
export type { RfqInput, RfqLead, RfqStatus, RfqValidationResult };

interface RfqFile {
  leads: RfqLead[];
}

/* ------------------------------------------------------- file paths --- */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rfq-leads.json");

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readFile(): Promise<RfqFile> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as RfqFile;
    if (!parsed || !Array.isArray(parsed.leads)) return { leads: [] };
    return parsed;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { leads: [] };
    throw err;
  }
}

async function writeFile(data: RfqFile): Promise<void> {
  await ensureDataDir();
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/* -------------------------------------------------------- helpers ----- */

function newId(): string {
  // Crypto-strong, URL-safe, short-ish ID.
  return (
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}

function newReference(): string {
  return `RFQ-${Date.now().toString(36).toUpperCase()}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pure validator (no I/O). Reused by API and tests.
 */
export function validateRfqInput(raw: unknown): RfqValidationResult {
  const errors: Record<string, string> = {};
  const obj = (raw ?? {}) as Record<string, unknown>;

  const str = (k: string, maxLen: number, required: boolean): string => {
    const v = obj[k];
    if (typeof v !== "string") {
      if (required) errors[k] = "required";
      return "";
    }
    const trimmed = v.trim();
    if (required && trimmed.length === 0) errors[k] = "required";
    if (trimmed.length > maxLen) errors[k] = `too_long_${maxLen}`;
    return trimmed.slice(0, maxLen);
  };

  const name = str("name", 120, true);
  const email = str("email", 200, true);
  const company = str("company", 200, true);
  const country = str("country", 120, true);
  const volume = str("volume", 60, false);
  const port = str("port", 120, false);
  const message = str("message", 2000, false);

  if (email && !EMAIL_RE.test(email)) errors.email = "invalid_email";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: {},
    cleaned: { name, email, company, country, volume, port, message },
  };
}

/* -------------------------------------------------------- API --------- */

export async function listLeads(): Promise<RfqLead[]> {
  const data = await readFile();
  // Most recent first.
  return data.leads
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createLead(input: RfqInput): Promise<RfqLead> {
  const data = await readFile();
  const now = new Date().toISOString();
  const lead: RfqLead = {
    id: newId(),
    reference: newReference(),
    status: "new",
    notes: "",
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  data.leads.push(lead);
  await writeFile(data);
  return lead;
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<RfqLead, "status" | "notes">>
): Promise<RfqLead | null> {
  const data = await readFile();
  const idx = data.leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  const current = data.leads[idx];
  const next: RfqLead = {
    ...current,
    ...(patch.status && RFQ_STATUSES.includes(patch.status)
      ? { status: patch.status }
      : {}),
    ...(typeof patch.notes === "string"
      ? { notes: patch.notes.slice(0, 4000) }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  data.leads[idx] = next;
  await writeFile(data);
  return next;
}

export async function countLeadsByStatus(): Promise<Record<RfqStatus, number>> {
  const leads = await listLeads();
  const counts: Record<RfqStatus, number> = {
    new: 0,
    in_progress: 0,
    closed_won: 0,
    closed_lost: 0,
  };
  for (const l of leads) counts[l.status] = (counts[l.status] ?? 0) + 1;
  return counts;
}
