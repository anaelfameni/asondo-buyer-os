/**
 * Demo-grade settings store. Persists the CEO console settings to a JSON
 * file under `<project>/data/settings.json`. Reused by:
 *   - the readiness-score widget (reads `readinessFlags`)
 *   - the /console/settings page (read + write)
 *
 * Same limitations as `lib/rfq-store.ts`: single-process, local-only.
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_FLAGS, ReadinessFlags } from "./readiness-score";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "settings.json");

/**
 * One row in the user-editable list of custom certifications shown in the
 * /console/settings page. Identified by a stable client-generated `id` so
 * React keys stay consistent across edits/reorders.
 */
export interface CustomCertification {
  id: string;
  name: string;
  status: "active" | "in_progress" | "pending";
  /** Optional ISO date (YYYY-MM-DD) — empty string when not set. */
  expiresAt: string;
}

export interface ConsoleSettings {
  readinessFlags: ReadinessFlags;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  geolocation: {
    /** Internal note about the GPS coverage progress. */
    notes: string;
    /** % of plots geolocated (0..100). */
    coveragePct: number;
  };
  certificates: {
    cccLicenceActive: boolean;
    rainforestStatus: "none" | "in_progress" | "certified";
    /**
     * Free-form short note for legacy data (FCC, UTZ, etc.). Kept for
     * backward compatibility with existing `data/settings.json` files;
     * structured entries live in `customList` below.
     */
    other: string;
    /**
     * User-managed list of additional certifications. Demo-grade: stored
     * verbatim in the JSON file, no per-row validation beyond the typed
     * `status` enum.
     */
    customList: CustomCertification[];
  };
  updatedAt: string;
}

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

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readSettings(): Promise<ConsoleSettings> {
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

export async function writeSettings(
  patch: Partial<ConsoleSettings>
): Promise<ConsoleSettings> {
  await ensureDataDir();
  const current = await readSettings();
  const next: ConsoleSettings = {
    ...current,
    ...patch,
    readinessFlags: { ...current.readinessFlags, ...(patch.readinessFlags ?? {}) },
    contact: { ...current.contact, ...(patch.contact ?? {}) },
    geolocation: { ...current.geolocation, ...(patch.geolocation ?? {}) },
    certificates: { ...current.certificates, ...(patch.certificates ?? {}) },
    updatedAt: new Date().toISOString(),
  };

  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  return next;
}

function mergeSettings(p: Partial<ConsoleSettings>): ConsoleSettings {
  return {
    readinessFlags: {
      ...DEFAULT_SETTINGS.readinessFlags,
      ...(p.readinessFlags ?? {}),
    },
    contact: { ...DEFAULT_SETTINGS.contact, ...(p.contact ?? {}) },
    geolocation: { ...DEFAULT_SETTINGS.geolocation, ...(p.geolocation ?? {}) },
    certificates: { ...DEFAULT_SETTINGS.certificates, ...(p.certificates ?? {}) },
    updatedAt: p.updatedAt ?? DEFAULT_SETTINGS.updatedAt,
  };
}
