/**
 * Buyer Pack download tracker.
 *
 * Persists every buyer-pack PDF generation to a flat JSON file under
 * `<project>/data/buyer-pack-downloads.json`. Mirrors the pattern used by
 * `lib/rfq-store.ts` so the CEO console can later display a "downloads"
 * tab with the same UX as the RFQ pipeline.
 *
 * Limitations (intentional, demo-grade):
 *   - Single-process, file-based store. Concurrency = best effort
 *     (atomic rename via tmp file). Swap for SQLite/Postgres before
 *     real production traffic.
 *   - No PII redaction at rest. Emails/IPs are stored as-is.
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "buyer-pack-downloads.json");

export type PackLang = "fr" | "en";

export interface BuyerPackDownload {
  id: string;
  /** ISO timestamp of generation. */
  createdAt: string;
  /** Buyer/company name passed in the form, if any. */
  buyerName: string | null;
  /** Buyer email if collected for soft gating. Optional. */
  email: string | null;
  /** Output language. */
  lang: PackLang;
  /** Best-effort client IP (header-extracted). */
  ip: string;
  /** User-Agent string truncated to 240 chars. */
  userAgent: string;
  /** PDF size in bytes. */
  sizeBytes: number;
  /** Origin of the call: public buyer site, CEO console "send pack", etc. */
  source: "public-cta" | "console-send" | "direct-link";
  /** Reference shown to the user (and embedded in the PDF filename). */
  reference: string;
}

interface StoreShape {
  downloads: BuyerPackDownload[];
}

const EMPTY: StoreShape = { downloads: [] };

async function ensureDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readStore(): Promise<StoreShape> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return { downloads: Array.isArray(parsed.downloads) ? parsed.downloads : [] };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { ...EMPTY, downloads: [] };
    throw err;
  }
}

async function writeStore(store: StoreShape): Promise<void> {
  await ensureDir();
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/* -------------------------------------------------------------- public API */

export interface RecordDownloadInput {
  buyerName?: string | null;
  email?: string | null;
  lang: PackLang;
  ip: string;
  userAgent: string;
  sizeBytes: number;
  source: BuyerPackDownload["source"];
}

/**
 * Persist a download. Generates a `BPK-XXXXXX` reference for the user
 * and the PDF filename. Returns the full record.
 */
export async function recordDownload(
  input: RecordDownloadInput
): Promise<BuyerPackDownload> {
  const reference = generateReference();
  const record: BuyerPackDownload = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    buyerName: clip(input.buyerName, 120),
    email: clip(input.email, 200),
    lang: input.lang,
    ip: input.ip,
    userAgent: clip(input.userAgent, 240) ?? "unknown",
    sizeBytes: Math.max(0, Math.round(input.sizeBytes)),
    source: input.source,
    reference,
  };

  const store = await readStore();
  store.downloads.unshift(record);
  // Cap retention to last 1000 entries to keep the file small.
  if (store.downloads.length > 1000) {
    store.downloads.length = 1000;
  }
  await writeStore(store);
  return record;
}

export async function listDownloads(limit = 100): Promise<BuyerPackDownload[]> {
  const store = await readStore();
  return store.downloads.slice(0, Math.max(1, Math.min(limit, 1000)));
}

/* --------------------------------------------------------------- helpers */

function generateReference(): string {
  // BPK-AB12CD format: visually distinct from RFQ-XXXX leads.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `BPK-${suffix}`;
}

function clip(value: string | null | undefined, max: number): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}
