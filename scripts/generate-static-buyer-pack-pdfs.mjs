/**
 * Generate the static Buyer Assurance Pack PDFs that ship in /public/.
 *
 * Why this script exists
 * ----------------------
 * The original strategy was to render the PDF on every download via
 * `/api/buyer-pack` (Puppeteer + @sparticuz/chromium on Vercel). That
 * path turned out fragile in production: cold-start time, lambda memory
 * limits, preview-deployment authentication, and Vercel's keep-alive
 * connections all conspired to make the dynamic flow unreliable enough
 * that the public CTA was returning "Server failed to generate the PDF"
 * to real visitors.
 *
 * Pragmatic fix: pre-render the document once on a developer machine,
 * commit the resulting `Asondo-Buyer-Pack-FR.pdf` and
 * `Asondo-Buyer-Pack-EN.pdf` under `public/`, and let the CTA serve
 * them as plain static assets. One click, real file on disk, 0 server
 * CPU, 0 cold-start risk, instant. Vercel's CDN handles the bytes; our
 * code path never touches Chromium in production.
 *
 * The dynamic Puppeteer endpoint is kept in place for the CEO console
 * "Send Pack" feature, which still wants a buyer-specific PDF
 * (different cover, different filename) — a low-traffic path used by
 * operators who can retry if the lambda has a hiccup.
 *
 * How to run
 * ----------
 *   pnpm build         # produce .next/ from current source
 *   node scripts/generate-static-buyer-pack-pdfs.mjs
 *
 * The script will:
 *   1. spin up `next start` on a free port,
 *   2. wait for /print/buyer-pack to respond 200,
 *   3. launch Edge (Windows) / Chrome (macOS/Linux) via puppeteer-core,
 *   4. snapshot the FR and EN versions to /public/,
 *   5. shut down the server and exit.
 *
 * The output is deterministic for the same source tree, so re-running
 * the script and `git diff public/*.pdf` is a fast way to preview what
 * changed in the document.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";
import puppeteer from "puppeteer-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");

/** Languages to render, in the order they're printed to the console. */
const LANGS = /** @type {const} */ (["fr", "en"]);

/** Returns the first installed browser executable on this host. */
function resolveBrowserPath() {
  const envOverride =
    process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (envOverride && existsSync(envOverride)) return envOverride;

  const candidates = [
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/microsoft-edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error(
    "No Edge/Chrome found. Set PUPPETEER_EXECUTABLE_PATH to a Chromium-compatible binary."
  );
}

/** Pick a port that isn't in use. */
function findFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on("error", reject);
    srv.listen(0, () => {
      const addr = srv.address();
      if (!addr || typeof addr === "string") {
        srv.close();
        reject(new Error("Could not get a free port"));
        return;
      }
      const port = addr.port;
      srv.close(() => resolve(port));
    });
  });
}

/** Poll http://localhost:<port>/ until it answers or we time out. */
async function waitForServer(port, timeoutMs = 60_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:${port}/`, {
        signal: AbortSignal.timeout(2_000),
      });
      // We don't care about the status — any HTTP answer means the
      // listener is up. The /print/buyer-pack route is dynamic and
      // will be rendered on demand by Puppeteer below.
      if (res.status) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server on :${port} did not become ready in ${timeoutMs} ms`);
}

/**
 * Start `next start -p <port>` as a child process and resolve once the
 * HTTP listener is responding. Returns the process handle so the
 * caller can kill it on exit.
 */
async function startNextServer(port) {
  const isWindows = process.platform === "win32";
  // Why `shell: true` on Windows: starting with Node 18.20.4 / 20.16.0
  // `spawn` refuses to execute `.cmd` / `.bat` shims directly (CVE
  // mitigation), throwing `spawn EINVAL`. Routing through the shell
  // restores the ability to invoke `pnpm.cmd` from a Node script.
  const child = spawn(
    isWindows ? "pnpm.cmd" : "pnpm",
    ["exec", "next", "start", "-p", String(port)],
    {
      cwd: PROJECT_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      shell: isWindows,
      env: {
        ...process.env,
        // Bypass the /print/buyer-pack token gate for this local run.
        // The PDF is generic, the data lives in lib/settings-store, no
        // sensitive value is exposed.
        PRINT_TOKEN: "",
      },
    }
  );

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[next] ${chunk}`);
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[next] ${chunk}`);
  });

  await waitForServer(port);
  return child;
}

async function main() {
  if (!existsSync(path.join(PROJECT_ROOT, ".next", "BUILD_ID"))) {
    throw new Error(
      "No .next/BUILD_ID found. Run `pnpm build` first so `next start` has output to serve."
    );
  }

  mkdirSync(PUBLIC_DIR, { recursive: true });

  const port = await findFreePort();
  console.log(`[script] using free port :${port}`);

  console.log("[script] starting `next start` …");
  const server = await startNextServer(port);
  console.log("[script] server is up");

  const browserPath = resolveBrowserPath();
  console.log(`[script] launching browser at ${browserPath}`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: browserPath,
    args: [
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
      "--hide-scrollbars",
    ],
  });

  try {
    for (const lang of LANGS) {
      const outFile = path.join(
        PUBLIC_DIR,
        `Asondo-Buyer-Pack-${lang.toUpperCase()}.pdf`
      );
      const url = `http://localhost:${port}/print/buyer-pack?lang=${lang}`;

      console.log(`[script] [${lang}] navigating to ${url}`);
      const page = await browser.newPage();
      await page.setViewport({
        width: 1240,
        height: 1754,
        deviceScaleFactor: 1,
      });

      const response = await page.goto(url, {
        waitUntil: "load",
        timeout: 30_000,
      });

      if (!response || !response.ok()) {
        throw new Error(
          `[${lang}] /print/buyer-pack returned ${response?.status()} — aborting`
        );
      }

      // Wait for Inter + Fraunces to finish loading, bounded by a
      // hard 3 s ceiling so a CSS-failure can't deadlock the script.
      await Promise.race([
        page.evaluate(() => document.fonts?.ready ?? Promise.resolve()),
        new Promise((r) => setTimeout(r, 3_000)),
      ]);

      const pdf = await page.pdf({
        format: "a4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      await writeFile(outFile, pdf);
      console.log(
        `[script] [${lang}] wrote ${outFile} (${(pdf.byteLength / 1024).toFixed(
          1
        )} kB)`
      );

      await page.close();
    }
  } finally {
    await browser.close().catch(() => {});
    // SIGTERM is not reliable on Windows; use tree-kill style fallback
    // by sending SIGKILL after a short grace period.
    server.kill();
    setTimeout(() => server.kill("SIGKILL"), 1_500).unref();
  }

  console.log("[script] done");
}

main().catch((err) => {
  console.error("[script] FAILED:", err);
  process.exit(1);
});
