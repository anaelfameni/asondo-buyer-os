/**
 * Pure RFQ types and runtime constants.
 *
 * No Node.js imports here — this module is safe to import from BOTH
 * server code (`lib/rfq-store.ts`, API routes) and client components
 * (`RFQTable.tsx`). Splitting types away from `rfq-store.ts` avoids
 * webpack trying to bundle `node:fs` into the browser bundle.
 */

export type RfqStatus = "new" | "in_progress" | "closed_won" | "closed_lost";

export const RFQ_STATUSES: RfqStatus[] = [
  "new",
  "in_progress",
  "closed_won",
  "closed_lost",
];

export interface RfqInput {
  name: string;
  email: string;
  company: string;
  country: string;
  volume?: string;
  port?: string;
  message?: string;
}

export interface RfqLead extends RfqInput {
  id: string;
  reference: string;
  status: RfqStatus;
  notes: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface RfqValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  cleaned?: RfqInput;
}
