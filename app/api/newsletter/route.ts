import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Newsletter sign-up endpoint.
 *
 * Today this is a deliberately small server-side capture that
 * appends each entry to a local JSON file. It is robust enough to
 * collect real email addresses while we finalise the CRM / ESP wiring
 * (Phase D6 follow-up: Mailerlite / Brevo / Mailjet).
 *
 * Future swap points:
 *   - Replace the `appendEntry` call with an upstream API call once
 *     the ESP account is provisioned.
 *   - Add a confirmation-email send to honour double opt-in. Right
 *     now subscribers are stored as `status: "pending"`, and the
 *     marketing operator can trigger the confirmation manually until
 *     automated sending is hooked up.
 */
export const runtime = "nodejs";

type SubscribePayload = {
  email?: unknown;
  locale?: unknown;
};

type StoredEntry = {
  email: string;
  locale: "fr" | "en";
  status: "pending" | "confirmed";
  ip: string;
  userAgent: string;
  createdAt: string;
};

// ----- Rate limiting -------------------------------------------------
// In-memory token bucket per source IP. Edge instances may rotate,
// so this is a best-effort defence — buyer-facing volume is low and
// the goal is to slow trivial scripts, not absolute rate enforcement.
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_HITS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RATE_MAX_HITS;
}

// ----- Email validation ---------------------------------------------
// Intentionally simple. We trust the client to submit something that
// looks like an email; downstream ESP validates more aggressively.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || trimmed.length > 254) return null;
  if (!EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

function normalizeLocale(raw: unknown): "fr" | "en" {
  if (raw === "en") return "en";
  return "fr";
}

// ----- Storage -------------------------------------------------------
async function appendEntry(entry: StoredEntry): Promise<void> {
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "newsletter.jsonl");
  await fs.mkdir(dir, { recursive: true });
  await fs.appendFile(file, `${JSON.stringify(entry)}\n`, "utf-8");
}

export async function POST(req: Request) {
  // Coarse IP detection. Vercel sets `x-forwarded-for`; in local dev
  // we fall back to a fixed placeholder so the rate limiter still
  // exercises its code path during testing.
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || "local";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: SubscribePayload;
  try {
    body = (await req.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const entry: StoredEntry = {
    email,
    locale: normalizeLocale(body.locale),
    status: "pending",
    ip,
    userAgent: req.headers.get("user-agent") ?? "",
    createdAt: new Date().toISOString(),
  };

  try {
    await appendEntry(entry);
  } catch (err) {
    // Storage failure should NOT leak details to the public. We log
    // server-side and reply with a generic 500 so the form can retry.
    console.error("[newsletter] storage failure", err);
    return NextResponse.json(
      { error: "storage_failure" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, status: "pending" }, { status: 201 });
}

export async function GET() {
  // Method-not-allowed but JSON-shaped so clients don't choke.
  return NextResponse.json(
    { error: "method_not_allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
