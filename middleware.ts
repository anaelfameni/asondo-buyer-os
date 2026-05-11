/**
 * Next.js middleware — protects /console/* routes.
 *
 * Runs on the Edge before any route handler/page renders. We do NOT import
 * `lib/auth.ts` here because that file uses `next/headers` (Node runtime).
 * The constant-time check is inlined and identical in semantics.
 */

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "asondo_console_session";

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /console/login itself is always reachable
  if (pathname === "/console/login" || pathname.startsWith("/console/login/")) {
    return NextResponse.next();
  }

  const cookieValue = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const expected = process.env.CONSOLE_SESSION_SECRET;

  const authed =
    typeof expected === "string" &&
    expected.length > 0 &&
    typeof cookieValue === "string" &&
    constantTimeEqual(cookieValue, expected);

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/console/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/console/:path*"],
};
