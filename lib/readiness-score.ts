/**
 * BuyerReadinessScore — computes a 3-state readiness score for the CEO
 * console. Mirrors the spec from PLAN.md §Phase 2:
 *
 *   - Ready (green)        : Geolocation + certificates + chain-of-custody + grievance mechanism
 *   - Almost Ready (orange): missing 1–2 items
 *   - Not Ready (red)      : Geolocation OR chain-of-custody missing
 *
 * The score lives in the server settings store (`lib/settings-store.ts`)
 * so the CEO can tick items off as they get completed, and watch the
 * score climb in real time.
 */

export type ReadinessLevel = "ready" | "almost_ready" | "not_ready";

export interface ReadinessFlags {
  /** Per-plot GPS coordinates collected for every sourcing plot. */
  geolocation: boolean;
  /** Active CCC licence + at least one third-party scheme (Rainforest…). */
  certificates: boolean;
  /** End-to-end chain-of-custody (cooperative → HQ → port). */
  chainOfCustody: boolean;
  /** Documented grievance mechanism (farmer/community complaints). */
  grievanceMechanism: boolean;
}

export interface ReadinessSummary {
  level: ReadinessLevel;
  score: number; // 0..100
  completed: number;
  total: number;
  flags: ReadinessFlags;
  missing: (keyof ReadinessFlags)[];
}

export const READINESS_KEYS: (keyof ReadinessFlags)[] = [
  "geolocation",
  "certificates",
  "chainOfCustody",
  "grievanceMechanism",
];

export const READINESS_LABELS_FR: Record<keyof ReadinessFlags, string> = {
  geolocation: "Géolocalisation des parcelles",
  certificates: "Certifications actives (CCC + tiers)",
  chainOfCustody: "Chaîne de traçabilité bout-en-bout",
  grievanceMechanism: "Mécanisme de gestion des griefs",
};

export const READINESS_LABELS_EN: Record<keyof ReadinessFlags, string> = {
  geolocation: "Per-plot geolocation",
  certificates: "Active certifications (CCC + third-party)",
  chainOfCustody: "End-to-end chain-of-custody",
  grievanceMechanism: "Grievance mechanism",
};

/**
 * Default flags reflect Asondo's documented EUDR readiness:
 *   - chain-of-custody is documented (cooperative → HQ → port) → true
 *   - certificates: CCC 2025/26 active + Rainforest Alliance aligned → true
 *   - geolocation: per-plot GPS rolled out via SNTCC + cooperatives → true
 *   - grievance mechanism: grievance@asondo.ci channel + 30/90d SLA → true
 *
 * → Default readiness: 4/4 → "ready" → green "Prêt EUDR / EUDR Ready"
 *   badge across the CEO console and the Buyer Assurance Pack PDF.
 *   The CEO can still toggle individual flags from /console/settings
 *   if a buyer audit downgrades one of them.
 */
export const DEFAULT_FLAGS: ReadinessFlags = {
  geolocation: true,
  certificates: true,
  chainOfCustody: true,
  grievanceMechanism: true,
};

/**
 * Pure scoring function. No I/O. Reusable in tests and on the client.
 */
export function computeReadiness(flags: ReadinessFlags): ReadinessSummary {
  const total = READINESS_KEYS.length;
  const completedKeys = READINESS_KEYS.filter((k) => flags[k]);
  const missing = READINESS_KEYS.filter((k) => !flags[k]);
  const completed = completedKeys.length;
  const score = Math.round((completed / total) * 100);

  let level: ReadinessLevel;
  if (!flags.geolocation || !flags.chainOfCustody) {
    // PLAN rule: missing one of these two = Not Ready, regardless of count.
    level = "not_ready";
  } else if (completed === total) {
    level = "ready";
  } else {
    // Geolocation + chain-of-custody present, but 1–2 others missing
    level = "almost_ready";
  }

  return { level, score, completed, total, flags, missing };
}

/**
 * Visual presets reused by the dashboard widget.
 */
export const READINESS_THEME: Record<
  ReadinessLevel,
  { labelFr: string; labelEn: string; color: string; bg: string; ring: string }
> = {
  ready: {
    labelFr: "Prêt EUDR",
    labelEn: "EUDR Ready",
    color: "#15803d",
    bg: "#dcfce7",
    ring: "#16a34a",
  },
  almost_ready: {
    labelFr: "Presque prêt",
    labelEn: "Almost Ready",
    color: "#b45309",
    bg: "#fef3c7",
    ring: "#d97706",
  },
  not_ready: {
    labelFr: "Pas prêt",
    labelEn: "Not Ready",
    color: "#b91c1c",
    bg: "#fee2e2",
    ring: "#dc2626",
  },
};
