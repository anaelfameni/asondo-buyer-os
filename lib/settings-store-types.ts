/**
 * Pure type definitions for the CEO console settings store.
 *
 * Split out from `lib/settings-store.ts` so:
 *   - `lib/settings-store-supabase.ts` can reuse them without importing
 *     the legacy file-based store (which is marked `server-only` and
 *     would otherwise drag node:fs into the bundle graph).
 *   - Client components (`SettingsForm.tsx`) can `import type` these
 *     definitions transitively through the re-export in
 *     `lib/settings-store.ts` without a runtime cycle.
 *
 * No runtime code here — types only.
 */

import type { ReadinessFlags } from "./readiness-score";

/**
 * One row in the user-editable list of custom certifications shown in
 * the /console/settings page. Identified by a stable client-generated
 * `id` so React keys stay consistent across edits/reorders.
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
     * User-managed list of additional certifications. Demo-grade:
     * stored verbatim in the JSON file / Supabase JSONB column, no
     * per-row validation beyond the typed `status` enum.
     */
    customList: CustomCertification[];
  };
  updatedAt: string;
}
