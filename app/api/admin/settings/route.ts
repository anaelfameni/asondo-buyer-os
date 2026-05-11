import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedFromCookies } from "@/lib/auth";
import {
  ConsoleSettings,
  readSettings,
  writeSettings,
} from "@/lib/settings-store";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!isAuthenticatedFromCookies()) return unauthorized();
  try {
    const settings = await readSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[/api/admin/settings][GET] error:", err);
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

  // Soft validation: trust shape, sanitize obvious things.
  const patch = (body ?? {}) as Partial<ConsoleSettings>;

  try {
    const updated = await writeSettings(patch);
    return NextResponse.json({ ok: true, settings: updated });
  } catch (err) {
    console.error("[/api/admin/settings][PATCH] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
