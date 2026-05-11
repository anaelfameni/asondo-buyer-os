import { NextRequest, NextResponse } from "next/server";
import {
  RFQ_STATUSES,
  RfqStatus,
  countLeadsByStatus,
  listLeads,
  updateLead,
} from "@/lib/rfq-store";
import { isAuthenticatedFromCookies } from "@/lib/auth";

/**
 * Admin RFQ endpoint.
 * GET   → list all leads + status counts (auth required)
 * PATCH → update status/notes of one lead     (auth required)
 *
 * Auth is enforced both by `middleware.ts` (for /console pages) and here
 * (for direct API calls), in case the middleware ever stops matching.
 */

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAuthenticatedFromCookies()) return unauthorized();

  try {
    const [leads, counts] = await Promise.all([
      listLeads(),
      countLeadsByStatus(),
    ]);
    return NextResponse.json({ leads, counts });
  } catch (err) {
    console.error("[/api/admin/rfq][GET] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticatedFromCookies()) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const id = typeof data.id === "string" ? data.id : null;
  if (!id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const status =
    typeof data.status === "string" && RFQ_STATUSES.includes(data.status as RfqStatus)
      ? (data.status as RfqStatus)
      : undefined;
  const notes = typeof data.notes === "string" ? data.notes : undefined;

  if (status === undefined && notes === undefined) {
    return NextResponse.json({ error: "no_fields_to_update" }, { status: 400 });
  }

  try {
    const updated = await updateLead(id, { status, notes });
    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, lead: updated });
  } catch (err) {
    console.error("[/api/admin/rfq][PATCH] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
