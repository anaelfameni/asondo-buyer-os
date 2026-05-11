import { NextRequest, NextResponse } from "next/server";
import { createLead, validateRfqInput } from "@/lib/rfq-store";

/**
 * POST /api/rfq
 * Public endpoint: anyone can submit an RFQ from the buyer-facing site.
 * Validates inputs, then persists the lead via the file-based store.
 *
 * Response shape:
 *   200 → { ok: true, reference: "RFQ-XXXX", id: "..." }
 *   400 → { ok: false, errors: { field: "code", ... } }
 *   500 → { ok: false, error: "internal_error" }
 */

// Force Node.js runtime (file system access).
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad_request" },
      { status: 400 }
    );
  }

  const validation = validateRfqInput(body);
  if (!validation.ok || !validation.cleaned) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 400 }
    );
  }

  try {
    const lead = await createLead(validation.cleaned);
    return NextResponse.json({
      ok: true,
      reference: lead.reference,
      id: lead.id,
    });
  } catch (err) {
    console.error("[/api/rfq] persist error:", err);
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 }
    );
  }
}
