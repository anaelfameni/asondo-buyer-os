/**
 * POST /api/buyer-pack-track
 *
 * Lightweight companion to the new client-side print flow.
 *
 * Background
 * ----------
 * Until recently, `POST /api/buyer-pack` did two things at once:
 *   1. Generated a PDF server-side via Puppeteer + @sparticuz/chromium.
 *   2. Persisted a "download lead" in `lib/buyer-pack-store.ts`.
 *
 * On Vercel's Hobby tier the first step is fragile (large Chromium
 * binary, cold-start latency, maxDuration cap). To keep the visitor
 * experience bulletproof we now render the Buyer Assurance Pack
 * directly in their browser at `/print/buyer-pack`, which auto-fires
 * `window.print()` so they can "Save as PDF" via the native dialog.
 *
 * That removes the server PDF call — but we still want to know that
 * the document was requested, when, and from where, so the CEO console
 * shows the same downloads timeline as before. This route is the
 * tracker for the new flow: takes a minimal JSON body, rate-limits,
 * records the lead, and returns the generated reference. The PDF
 * itself is never touched here.
 *
 * The legacy `/api/buyer-pack` Puppeteer route is kept untouched as a
 * fallback for the CEO console "Send Pack" feature, which still wants
 * a real binary attachment to email.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { recordDownload, type PackLang } from "@/lib/buyer-pack-store";

export const runtime = "nodejs";
export const maxDuration = 10;

interface BodyShape {
  lang?: string;
  buyerName?: string;
  email?: string;
  source?: "public-cta" | "console-send" | "direct-link";
}

export async function POST(req: NextRequest) {
  /* Body parsing (lenient — fully empty body is allowed). */
  let body: BodyShape = {};
  try {
    if (req.headers.get("content-length") !== "0") {
      const parsed = (await req.json()) as unknown;
      if (parsed && typeof parsed === "object") body = parsed as BodyShape;
    }
  } catch {
    body = {};
  }

  const lang: PackLang = body.lang === "fr" ? "fr" : "en";
  const buyerName = sanitizeFreeText(body.buyerName, 120);
  const email = sanitizeEmail(body.email);
  const source = (body.source ?? "public-cta") as BodyShape["source"];
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  /*
   * Per-IP rate limit. Slightly higher than the Puppeteer route (which
   * was 5/h) because this one is essentially free server-side — but
   * we still cap it to keep the lead table clean from refresh storms.
   */
  const rl = rateLimit(`buyer-pack-track:${ip}`, {
    windowMs: 60 * 60 * 1000,
    max: 20,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        retryAfterMs: rl.retryAfterMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rl.retryAfterMs / 1000).toString(),
        },
      }
    );
  }

  let reference = "BPK";
  try {
    const record = await recordDownload({
      buyerName: buyerName ?? null,
      email: email ?? null,
      lang,
      ip,
      userAgent,
      // We never see the actual PDF on this code path, so report 0.
      // The CEO console treats `sizeBytes: 0` as "client-rendered".
      sizeBytes: 0,
      source: source ?? "public-cta",
    });
    reference = record.reference;
  } catch (err) {
    // Persistence is best-effort. A failed write must not look like an
    // error to the visitor — the document already opened in their tab.
    console.warn("[/api/buyer-pack-track] persist failed (non-fatal):", err);
  }

  return NextResponse.json({ ok: true, reference }, { status: 200 });
}

/* ----------------------------------------------------------- helpers */

function sanitizeFreeText(
  raw: string | undefined | null,
  max: number
): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const cleaned = raw.replace(/[<>"/\\\n\r\t]/g, "").trim();
  if (!cleaned) return undefined;
  return cleaned.length > max ? cleaned.slice(0, max) : cleaned;
}

function sanitizeEmail(raw: string | undefined | null): string | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (!/^\S+@\S+\.\S+$/.test(trimmed)) return undefined;
  return trimmed.length > 200 ? trimmed.slice(0, 200) : trimmed;
}
