/**
 * Demo-grade authentication helpers for the Asondo CEO Console.
 *
 * SCOPE: a single-user, password-based session used to gate the `/console`
 * routes during demos. Replace with Supabase Auth or NextAuth before
 * inviting more than one user or before shipping production credentials.
 *
 * Configuration: two server-side env vars (never `NEXT_PUBLIC_*`):
 *   - CONSOLE_PASSWORD          → what the user types on /console/login
 *   - CONSOLE_SESSION_SECRET    → opaque cookie value set after login;
 *                                 also used as the constant-time equality
 *                                 check on each protected request
 */

import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "asondo_console_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Constant-time string comparison. Returns true if both strings are equal
 * AND share the same length. Avoids leaking length/content via timing.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Returns whether the console is properly configured (both env vars set).
 * If false, login should refuse to authenticate anyone.
 */
export function isConsoleConfigured(): boolean {
  return Boolean(
    process.env.CONSOLE_PASSWORD && process.env.CONSOLE_SESSION_SECRET
  );
}

/**
 * Validates a user-supplied password against the configured one.
 */
export function verifyPassword(input: unknown): boolean {
  if (!isConsoleConfigured()) return false;
  if (typeof input !== "string") return false;
  return constantTimeEqual(input, process.env.CONSOLE_PASSWORD!);
}

/**
 * The opaque cookie value to set on successful login.
 * (Same value lives in the env; we compare with constant-time equality.)
 */
export function getSessionTokenValue(): string {
  return process.env.CONSOLE_SESSION_SECRET ?? "";
}

/**
 * Validates a cookie value sent by the client.
 */
export function isSessionCookieValid(cookieValue: string | undefined): boolean {
  if (!isConsoleConfigured()) return false;
  if (!cookieValue) return false;
  return constantTimeEqual(cookieValue, getSessionTokenValue());
}

/**
 * Server-side helper for Server Components and Route Handlers.
 * Returns true if the current request carries a valid session cookie.
 */
export function isAuthenticatedFromCookies(): boolean {
  const cookieStore = cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return isSessionCookieValid(value);
}
