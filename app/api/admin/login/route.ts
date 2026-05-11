import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  getSessionTokenValue,
  isConsoleConfigured,
  verifyPassword,
} from "@/lib/auth";

/**
 * POST /api/admin/login
 * Body: { password: string }
 * On success: sets HttpOnly cookie `asondo_console_session` and returns
 * { ok: true }. On failure: 401 with { error: "invalid_credentials" }.
 */
export async function POST(req: NextRequest) {
  if (!isConsoleConfigured()) {
    return NextResponse.json(
      { error: "console_not_configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? (body as { password: unknown }).password
      : undefined;

  if (!verifyPassword(password)) {
    // Small artificial delay to throttle brute force attempts a bit.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { error: "invalid_credentials" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, getSessionTokenValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}
