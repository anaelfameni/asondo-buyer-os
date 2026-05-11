/**
 * Server-side QR code rendering for the Buyer Pack closing page.
 *
 * Uses the `qrcode` package to emit a self-contained <svg> string
 * (no external image, embeds cleanly into the PDF, scales to any size
 * because Puppeteer rasterises SVG at print resolution).
 *
 * Why SVG over PNG :
 *   - sharp at any DPI (the PDF renderer reflows it)
 *   - no Buffer/base64 plumbing through the render tree
 *   - small (≤ 2 KB for typical URLs)
 */

import "server-only";
import QRCode from "qrcode";

interface QrOptions {
  /** SVG width/height in pixels. Defaults to 160. */
  size?: number;
  /** Foreground color (modules). Defaults to Asondo deep green. */
  fg?: string;
  /** Background color. Defaults to white. */
  bg?: string;
}

export async function renderQrSvg(
  url: string,
  opts: QrOptions = {}
): Promise<string> {
  const size = opts.size ?? 160;
  const fg = opts.fg ?? "#1F3D2F";
  const bg = opts.bg ?? "#FFFFFF";

  try {
    // `toString` with type=svg returns a self-contained SVG document
    // already sized to the `width` option.
    const svg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      width: size,
      color: { dark: fg, light: bg },
    });
    return svg;
  } catch (err) {
    // Defensive fallback: render a visually-distinct placeholder so the
    // PDF still ships, and log the error for the operator to fix.
    console.error("[lib/qr] renderQrSvg failed:", err);
    return placeholderSvg(size, fg, bg);
  }
}

function placeholderSvg(size: number, fg: string, bg: string): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
      <rect width="100" height="100" fill="${bg}" />
      <rect x="6" y="6" width="22" height="22" fill="${fg}" />
      <rect x="72" y="6" width="22" height="22" fill="${fg}" />
      <rect x="6" y="72" width="22" height="22" fill="${fg}" />
      <rect x="40" y="40" width="20" height="20" fill="${fg}" />
      <text x="50" y="58" text-anchor="middle" font-size="6" font-weight="700" fill="${bg}">QR</text>
    </svg>
  `.trim();
}
