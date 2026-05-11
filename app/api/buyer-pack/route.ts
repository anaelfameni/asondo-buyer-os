/**
 * POST /api/buyer-pack
 *
 * Generates the Asondo Buyer Assurance Pack PDF on demand.
 *
 * Flow :
 *   1. Validate body { lang, buyerName?, email?, source? }
 *   2. Rate-limit (5 req / hour / IP) via lib/rate-limit.ts
 *   3. Optionally persist a "download lead" via lib/buyer-pack-store.ts
 *   4. Launch a singleton headless Chrome (kept warm 30s between calls)
 *   5. Navigate to internal `/print/buyer-pack?lang=...&buyer=...&token=`
 *   6. Snapshot to PDF (A4, printBackground, preferCSSPageSize)
 *   7. Stream the buffer as `application/pdf`
 *
 * Browser strategy — two runtimes, one code path :
 *
 *   • Local dev (Windows / macOS / Linux laptop): we reuse Microsoft
 *     Edge or Google Chrome already installed on the host. Set
 *     `PUPPETEER_EXECUTABLE_PATH` to override the auto-discovery.
 *
 *   • Vercel / AWS Lambda: there is no system Chrome on the function
 *     filesystem, so we launch `@sparticuz/chromium`'s Lambda-compatible
 *     Chromium binary instead. This is the canonical workaround for
 *     serverless headless rendering — `puppeteer-core` provides the
 *     control protocol, `@sparticuz/chromium` provides the binary.
 *
 *   The runtime path is selected by `process.env.VERCEL` (set to "1"
 *   by Vercel on every deployment and preview).
 */

import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "node:fs";
import puppeteer, { type Browser } from "puppeteer-core";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { recordDownload, type PackLang } from "@/lib/buyer-pack-store";

export const runtime = "nodejs";
// Allow up to 60 s for cold-start Chromium boot + render.
//
// Why 60 s
// --------
// On a cold Vercel lambda, @sparticuz/chromium has to decompress its
// ~60 MB tar.br binary from /var/task before Puppeteer can launch.
// That decompression alone takes 4-8 s on x86 Lambda, and the first
// `browser.launch()` adds another 2-3 s. Then navigation + render adds
// another 5-10 s for a 7-page A4 document. So the realistic worst-case
// total is ~20-25 s, well inside this budget. The 60 s ceiling is
// available on the Vercel Hobby tier since 2024 and gives us margin if
// the lambda is very cold or Vercel's egress is throttled.
export const maxDuration = 60;

/* --------------------------------------------------- Browser singleton */

let browserPromise: Promise<Browser> | null = null;
let lastUsedAt = 0;
const KEEPALIVE_MS = 30_000;

/**
 * Truthy when we're running inside a Vercel serverless function (any
 * environment: production, preview, branch deploys). We don't trust
 * NODE_ENV here — it's "production" in `next start` on the laptop too,
 * which is the exact case where we *want* to use the local Chrome path.
 */
const IS_VERCEL = process.env.VERCEL === "1" || process.env.VERCEL === "true";

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = IS_VERCEL ? launchServerless() : launchLocal();
  }
  const browser = await browserPromise;
  lastUsedAt = Date.now();
  // Schedule a passive cleanup if no activity for KEEPALIVE_MS.
  setTimeout(() => {
    if (Date.now() - lastUsedAt >= KEEPALIVE_MS && browserPromise) {
      const old = browserPromise;
      browserPromise = null;
      old.then((b) => b.close()).catch(() => {});
    }
  }, KEEPALIVE_MS + 100);
  return browser;
}

/**
 * Vercel / Lambda launch path. We import `@sparticuz/chromium`
 * dynamically (not at the top of the file) so a missing local install
 * on a developer's machine doesn't break `next build` for someone who
 * is not actually deploying — Vercel always installs it via
 * package.json before the build runs.
 */
async function launchServerless(): Promise<Browser> {
  // The dep is declared in package.json; Vercel installs it during
  // the build. Hidden behind a runtime conditional + dynamic import
  // so the module is never touched on a local Windows laptop. Types
  // come from the ambient declaration in `types/sparticuz-chromium.d.ts`,
  // and the package is marked as a webpack external in `next.config.mjs`
  // so Node loads it natively at runtime (only on Vercel, never locally).
  const t0 = Date.now();
  let chromium: typeof import("@sparticuz/chromium").default;
  try {
    const mod = await import("@sparticuz/chromium");
    chromium = (mod.default ?? mod) as typeof import("@sparticuz/chromium").default;
  } catch (err) {
    console.error(
      "[/api/buyer-pack] Failed to dynamic-import @sparticuz/chromium. " +
        "Check that the package is in production dependencies (NOT devDependencies) " +
        "and that next.config.mjs marks it as a server-only external.",
      err
    );
    throw err;
  }

  let executablePath: string;
  try {
    executablePath = await chromium.executablePath();
  } catch (err) {
    console.error(
      "[/api/buyer-pack] chromium.executablePath() rejected. " +
        "The Lambda binary failed to decompress — usually means the function " +
        "ran out of memory or /tmp space. Check Vercel function memory setting.",
      err
    );
    throw err;
  }

  console.log(
    `[/api/buyer-pack] Launching @sparticuz/chromium at ${executablePath} ` +
      `(import+decompress took ${Date.now() - t0} ms)`
  );

  /*
   * Args reference: @sparticuz/chromium exposes a curated `args` list
   * tuned for AWS Lambda / Vercel functions (disables /dev/shm, GPU,
   * sandbox, etc.). We append two more flags:
   *   - --font-render-hinting=none: avoid micro-differences in glyph
   *     positioning between local dev and serverless rendering, so
   *     designers can preview the PDF on Windows and trust what's
   *     produced on Vercel.
   *   - --hide-scrollbars: prevents a stray Chromium scrollbar from
   *     leaking into the snapshot if a page slightly overflows.
   */
  return puppeteer.launch({
    headless: true,
    args: [
      ...chromium.args,
      "--font-render-hinting=none",
      "--hide-scrollbars",
    ],
    executablePath,
    defaultViewport: chromium.defaultViewport ?? undefined,
    // Bound the launch itself so we fail fast instead of consuming the
    // whole maxDuration budget on a broken binary.
    timeout: 25_000,
  });
}

/**
 * Local development launch path. Reuses an Edge / Chrome / Chromium
 * binary already installed on the developer's machine.
 */
async function launchLocal(): Promise<Browser> {
  const executablePath = resolveExecutablePath();
  if (!executablePath) {
    throw new Error(
      "No Chrome/Edge executable found. Install Microsoft Edge or Google Chrome, " +
        "or set PUPPETEER_EXECUTABLE_PATH to a Chromium-compatible binary."
    );
  }
  return puppeteer.launch({
    headless: true,
    executablePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
      "--disable-gpu",
    ],
  });
}

/**
 * Locate a Chromium-compatible browser already installed on the host.
 * Returns the first existing path. Honors `PUPPETEER_EXECUTABLE_PATH`
 * and `CHROME_PATH` env overrides.
 */
function resolveExecutablePath(): string | null {
  const envOverride =
    process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (envOverride && existsSync(envOverride)) return envOverride;

  const candidates: string[] = [];
  if (process.platform === "win32") {
    const programFiles =
      process.env["ProgramFiles"] || "C:\\Program Files";
    const programFilesX86 =
      process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    const localAppData =
      process.env["LOCALAPPDATA"] ||
      `${process.env.USERPROFILE ?? ""}\\AppData\\Local`;
    candidates.push(
      // Microsoft Edge — installed by default on Windows 10/11
      `${programFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${programFilesX86}\\Microsoft\\Edge\\Application\\msedge.exe`,
      // Google Chrome
      `${programFiles}\\Google\\Chrome\\Application\\chrome.exe`,
      `${programFilesX86}\\Google\\Chrome\\Application\\chrome.exe`,
      `${localAppData}\\Google\\Chrome\\Application\\chrome.exe`,
      // Chromium
      `${programFiles}\\Chromium\\Application\\chrome.exe`
    );
  } else if (process.platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      "/Applications/Chromium.app/Contents/MacOS/Chromium"
    );
  } else {
    candidates.push(
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
      "/snap/bin/chromium",
      "/usr/bin/microsoft-edge"
    );
  }

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/* ------------------------------------------------------------------ POST */

interface BodyShape {
  lang?: string;
  buyerName?: string;
  email?: string;
  source?: "public-cta" | "console-send" | "direct-link";
}

export async function POST(req: NextRequest) {
  /* Body parsing */
  let body: BodyShape = {};
  try {
    if (req.headers.get("content-length") !== "0") {
      const parsed = (await req.json()) as unknown;
      if (parsed && typeof parsed === "object") body = parsed as BodyShape;
    }
  } catch {
    // empty body is allowed (defaults to en, no buyer)
    body = {};
  }

  const lang: PackLang = body.lang === "fr" ? "fr" : "en";
  const buyerName = sanitizeFreeText(body.buyerName, 120);
  const email = sanitizeEmail(body.email);
  const source = (body.source ?? "public-cta") as BodyShape["source"];
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  /* Rate-limit (5 / hour / IP) */
  const rl = rateLimit(`buyer-pack:${ip}`, {
    windowMs: 60 * 60 * 1000,
    max: 5,
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

  /* PDF generation */
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generatePdf(req, { lang, buyer: buyerName });
  } catch (err) {
    console.error("[/api/buyer-pack] generation failed:", err);
    return NextResponse.json(
      { ok: false, error: "generation_failed" },
      { status: 500 }
    );
  }

  /* Persist download lead (best-effort, never blocks the response) */
  let reference = "BPK";
  try {
    const record = await recordDownload({
      buyerName: buyerName ?? null,
      email: email ?? null,
      lang,
      ip,
      userAgent,
      sizeBytes: pdfBuffer.byteLength,
      source: source ?? "public-cta",
    });
    reference = record.reference;
  } catch (err) {
    console.warn("[/api/buyer-pack] tracking failed (non-fatal):", err);
  }

  /* Stream PDF */
  const today = new Date().toISOString().slice(0, 10);
  const filename = buyerName
    ? `Asondo-Buyer-Pack-${slugSafe(buyerName)}-${today}.pdf`
    : `Asondo-Buyer-Pack-${today}.pdf`;

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.byteLength.toString(),
      "Cache-Control": "no-store, must-revalidate",
      "X-Buyer-Pack-Ref": reference,
    },
  });
}

/* --------------------------------------------------------- generatePdf */

async function generatePdf(
  req: NextRequest,
  opts: { lang: PackLang; buyer?: string | null }
): Promise<Buffer> {
  // First attempt: normal path. If it fails with a transient error
  // (network unreachable / nav timeout / "Print route returned 5xx"),
  // we retry once after a short delay. The first request after a
  // dev-server boot or a cold Puppeteer launch sometimes loses the
  // race against the internal Next.js HTTP listener becoming ready —
  // exactly the "first click does nothing, second click works" pattern
  // reported by the user. A bounded retry inside the same request is
  // far better UX than asking the visitor to click twice.
  try {
    return await renderPdfOnce(req, opts);
  } catch (err) {
    if (!isTransientNavError(err)) throw err;
    console.warn(
      "[/api/buyer-pack] first render attempt failed, retrying once:",
      err instanceof Error ? err.message : err
    );
    await new Promise((r) => setTimeout(r, 600));
    return renderPdfOnce(req, opts);
  }
}

/**
 * Single attempt: open a fresh page, navigate, snapshot, close.
 * Kept small so the retry path above can call it twice with a
 * different page instance every time (avoids stale request
 * interception state on Puppeteer's side).
 */
async function renderPdfOnce(
  req: NextRequest,
  opts: { lang: PackLang; buyer?: string | null }
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 1 });

    // Build internal URL pointing back at this same Next.js server.
    const baseUrl = resolveBaseUrl(req);
    const url = new URL("/print/buyer-pack", baseUrl);
    url.searchParams.set("lang", opts.lang);
    if (opts.buyer) url.searchParams.set("buyer", opts.buyer);
    if (process.env.PRINT_TOKEN) {
      url.searchParams.set("token", process.env.PRINT_TOKEN);
    }

    /*
     * `waitUntil: "load"` is intentionally less strict than
     * `"networkidle0"`. The print route is a static, pre-rendered HTML
     * document — there are no streaming responses, no analytics
     * beacons, no chat widgets. Waiting for full network idle adds a
     * mandatory 500 ms quiet-period at the end, *and* it can hang
     * indefinitely when a Vercel preview lambda has a long-lived
     * keep-alive HTTP connection back to the platform. `"load"` fires
     * as soon as all initial subresources (CSS, fonts inlined by
     * `next/font`, images) are loaded — exactly what we need before
     * snapshotting. The fonts.ready handle below is the belt to this
     * suspenders.
     */
    const response = await page.goto(url.toString(), {
      waitUntil: "load",
      timeout: 30_000,
    });

    if (!response || !response.ok()) {
      throw new Error(
        `Print route returned ${response?.status()} for ${url.toString()}`
      );
    }

    // Wait for fonts (Inter + Fraunces) to be applied so glyph metrics
    // are stable before we snapshot. Bounded: if `document.fonts` is
    // unavailable for any reason, we don't want to hang.
    await Promise.race([
      page.evaluate(() => document.fonts?.ready ?? Promise.resolve()),
      new Promise((resolve) => setTimeout(resolve, 3_000)),
    ]);

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}

/**
 * Heuristic that classifies an error as worth retrying once.
 *
 * We only retry truly transient failure modes:
 *   - Puppeteer navigation timeouts ("Navigation timeout of … exceeded")
 *   - "net::ERR_*" Chromium network errors
 *   - 5xx responses from the internal print route (server warming up)
 *   - "Target closed" / "Session closed" Puppeteer errors when the
 *     browser singleton has just been recycled.
 *
 * 4xx, missing executable, build / TypeScript errors etc. are NOT
 * retried — the second attempt would always fail too.
 */
function isTransientNavError(err: unknown): boolean {
  const msg =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";
  if (!msg) return false;
  return (
    /Navigation timeout/i.test(msg) ||
    /net::ERR_/i.test(msg) ||
    /Print route returned 5\d\d/i.test(msg) ||
    /Target closed/i.test(msg) ||
    /Session closed/i.test(msg) ||
    /Protocol error/i.test(msg) ||
    /ECONNREFUSED|ECONNRESET|EAI_AGAIN/i.test(msg)
  );
}

/* ----------------------------------------------------------- helpers */

function resolveBaseUrl(req: NextRequest): string {
  // Trust the request's own origin in dev/prod when available.
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const host = req.headers.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

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
  // Minimal sanity check; full validation happens elsewhere on the form.
  if (!/^\S+@\S+\.\S+$/.test(trimmed)) return undefined;
  return trimmed.length > 200 ? trimmed.slice(0, 200) : trimmed;
}

function slugSafe(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "buyer";
}
