/**
 * CEO console settings store — adaptive backend.
 *
 * Same dual-backend pattern as `lib/rfq-store.ts`:
 *
 *   1. Supabase Postgres, when `SUPABASE_URL` and
 *      `SUPABASE_SERVICE_ROLE_KEY` are both set in the runtime env.
 *      This is the production path on Vercel, where the local
 *      filesystem is read-only and ephemeral, so previous file-based
 *      writes either failed silently with EROFS or were wiped on the
 *      next cold start (the "Enregistrer ne marche pas" bug on
 *      `/console/settings`).
 *
 *   2. Local JSON file under `<project>/data/settings.json`, when
 *      Supabase env vars are absent. Each write is atomic (write to
 *      .tmp then rename). Adequate for `pnpm dev` on a developer
 *      laptop. Same shape, same return values — the API routes, the
 *      Buyer Pack PDF generator and the /console pages don't see
 *      which backend was used.
 *
 * Reused by:
 *   - the readiness-score widget (reads `readinessFlags`)
 *   - the /console/settings page (read + write)
 *   - the /print/buyer-pack PDF (reads everything)
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_FLAGS } from "./readiness-score";
import type {
  ConsoleSettings,
  CustomCertification,
} from "./settings-store-types";
import {
  isSupabaseSettingsConfigured,
  readSettingsSupabase,
  writeSettingsSupabase,
} from "./settings-store-supabase";

// Re-export so existing server + client imports
// (`import type { ConsoleSettings } from "@/lib/settings-store"`)
// keep working unchanged.
export type { ConsoleSettings, CustomCertification };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS: ConsoleSettings = {
  readinessFlags: { ...DEFAULT_FLAGS },
  contact: {
    name: "Mr. Lassana Diallo",
    email: "admin@asondo.ci",
    phone: "+225 07 99 85 29 16",
  },
  geolocation: {
    notes:
      "SNTCC enrollment in progress. Per-plot GPS coordinates collected through partner cooperatives. Detailed per-buyer disclosure under NDA.",
    coveragePct: 35,
  },
  certificates: {
    cccLicenceActive: true,
    rainforestStatus: "in_progress",
    other: "",
    customList: [],
  },
  updatedAt: new Date(0).toISOString(),
};

/* --------------------------------------------------------- file backend */

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readSettingsFile(): Promise<ConsoleSettings> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<ConsoleSettings>;
    return mergeSettings(parsed);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...DEFAULT_SETTINGS };
    }
    throw err;
  }
}

async function writeSettingsFile(next: ConsoleSettings): Promise<void> {
  await ensureDataDir();
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/* ----------------------------------------------------------- public API */

/**
 * Returns which backend is currently in use. Useful for diagnostics.
 * Same contract as `getActiveBackend()` in `lib/rfq-store.ts`.
 */
export function getActiveSettingsBackend(): "supabase" | "file" {
  return isSupabaseSettingsConfigured() ? "supabase" : "file";
}

export async function readSettings(): Promise<ConsoleSettings> {
  if (isSupabaseSettingsConfigured()) {
    const row = await readSettingsSupabase();
    // Fresh project, no row yet → fall back to defaults so the page
    // still renders. The next save will create the row.
    return row ? mergeSettings(row) : { ...DEFAULT_SETTINGS };
  }
  return readSettingsFile();
}

export async function writeSettings(
  patch: Partial<ConsoleSettings>
): Promise<ConsoleSettings> {
  const current = await readSettings();
  const next: ConsoleSettings = {
    ...current,
    ...patch,
    readinessFlags: {
      ...current.readinessFlags,
      ...(patch.readinessFlags ?? {}),
    },
    contact: { ...current.contact, ...(patch.contact ?? {}) },
    geolocation: { ...current.geolocation, ...(patch.geolocation ?? {}) },
    certificates: { ...current.certificates, ...(patch.certificates ?? {}) },
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseSettingsConfigured()) {
    return writeSettingsSupabase(next);
  }
  await writeSettingsFile(next);
  return next;
}

/* --------------------------------------------------------------- utils */

function mergeSettings(p: Partial<ConsoleSettings>): ConsoleSettings {
  return {
    readinessFlags: {
      ...DEFAULT_SETTINGS.readinessFlags,
      ...(p.readinessFlags ?? {}),
    },
    contact: { ...DEFAULT_SETTINGS.contact, ...(p.contact ?? {}) },
    geolocation: { ...DEFAULT_SETTINGS.geolocation, ...(p.geolocation ?? {}) },
    certificates: {
      ...DEFAULT_SETTINGS.certificates,
      ...(p.certificates ?? {}),
      // `customList` is an array, not an object — replace, don't merge,
      // so the user can delete a row and have it actually disappear.
      customList:
        p.certificates?.customList ?? DEFAULT_SETTINGS.certificates.customList,
    },
    updatedAt: p.updatedAt ?? DEFAULT_SETTINGS.updatedAt,
  };
}
