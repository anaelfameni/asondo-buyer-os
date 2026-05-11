"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

/**
 * Auto-print orchestrator for the Buyer Assurance Pack.
 *
 * Why this exists
 * ---------------
 * The original PDF flow uses Puppeteer server-side (`/api/buyer-pack`) to
 * snapshot this page into a real PDF blob. That flow is now used as a
 * legacy fallback only — on Vercel's Hobby tier, cold-starting Chromium
 * via `@sparticuz/chromium` is fragile (large binary, tight maxDuration
 * budget). The robust path is to render the same Next.js page in the
 * visitor's own browser and trigger the browser's native "Print" dialog:
 *
 *   - 0 server CPU spent on PDF generation.
 *   - 0 cold-start latency, 0 timeouts.
 *   - Identical typographical output (it's the same Chromium engine).
 *   - The visitor saves as PDF via "Destination → Save as PDF" in the
 *     print dialog, which every modern desktop browser ships natively.
 *
 * UX
 * --
 * On first mount we wait for `document.fonts.ready` so Inter + Fraunces
 * are loaded before the snapshot, then we call `window.print()`. If the
 * user dismisses the dialog (or it never fires because the browser
 * blocked the auto-call), we render a visible "Open the print dialog"
 * button so they can retry manually. The button is hidden in the actual
 * PDF output via the `no-print` class declared in `styles.css`.
 */
export function PrintTrigger({
  buttonLabel,
  helperText,
  closeLabel,
}: {
  buttonLabel: string;
  helperText: string;
  closeLabel: string;
}) {
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fire = async () => {
      try {
        // Wait for webfonts so the snapshot uses the correct glyph
        // metrics instead of fallback system fonts.
        if (document.fonts && typeof document.fonts.ready?.then === "function") {
          await document.fonts.ready;
        }
        // Give the layout one extra frame to settle (Image LCP, etc.)
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
      } catch {
        // Non-fatal — proceed anyway.
      }
      if (cancelled) return;
      try {
        window.print();
        setPrinted(true);
      } catch {
        // Browsers can throw if print is blocked. The manual button stays.
        setPrinted(false);
      }
    };
    // Defer slightly so the page has time to fully paint before the
    // print dialog steals focus.
    const id = window.setTimeout(fire, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  const handleManualPrint = () => {
    try {
      window.print();
      setPrinted(true);
    } catch {
      /* noop */
    }
  };

  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        fontFamily:
          "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(31,61,47,0.96)",
          color: "white",
          fontSize: 12,
          maxWidth: 280,
          boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
          lineHeight: 1.4,
        }}
      >
        {printed ? closeLabel : helperText}
      </div>
      <button
        type="button"
        onClick={handleManualPrint}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 999,
          background: "linear-gradient(135deg, #F2B83E, #D4A017)",
          color: "#1F3D2F",
          fontSize: 13,
          fontWeight: 700,
          border: 0,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(242,184,62,0.4)",
        }}
      >
        <Printer size={16} />
        {buttonLabel}
      </button>
    </div>
  );
}
