/**
 * P0 — Cover.
 *
 * Full-bleed orange hero illustration matching the public site's hero
 * banner mood:
 *   - vertical gradient from deep cocoa-orange to warm gold to cream
 *   - subtle dot pattern + grain for premium texture
 *   - sun-warm radial glow centred top-third
 *   - real Asondo logo PNG (public/asondologocomplet.PNG)
 *   - bottom strip with CCC mark + Côte d'Ivoire flag + licence ref
 *
 * The `<img>` for the logo is the only `/public/*` reference; Puppeteer
 * loads it through the local Next.js server before snapshot, so this
 * still works in offline / no-internet conditions.
 */

import type { PdfContent } from "@/lib/pdf-content";
import { Page } from "./shared";

interface CoverProps {
  content: PdfContent["cover"];
  legalFooter: string;
  buyer?: string;
  version: string;
  issuedDate: string;
  licenceLine: string;
}

export function Cover({
  content,
  legalFooter,
  buyer,
  version,
  issuedDate,
  licenceLine,
}: CoverProps) {
  return (
    <Page hideHeader hideFooter fullbleed variant="cream">
      <div style={coverWrap}>
        {/* Hero illustration (full bleed) */}
        <div style={heroWrap}>
          <svg
            viewBox="0 0 1100 720"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            <defs>
              {/*
               * Hero-matching orange gradient. Picked from the public
               * hero banner palette: deep ember red → cocoa orange →
               * gold → cream. Vertical so the title block sits on the
               * darker upper third and the bottom info card reads on
               * the warm middle band.
               */}
              <linearGradient id="cover-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8a2f0c" />
                <stop offset="22%" stopColor="#b8501a" />
                <stop offset="48%" stopColor="#d06b1f" />
                <stop offset="72%" stopColor="#e8833d" />
                <stop offset="90%" stopColor="#f2b83e" />
                <stop offset="100%" stopColor="#fad269" />
              </linearGradient>

              <radialGradient id="cover-glow" cx="50%" cy="28%" r="60%">
                <stop offset="0%" stopColor="rgba(255,232,170,0.55)" />
                <stop offset="55%" stopColor="rgba(255,200,120,0.12)" />
                <stop offset="100%" stopColor="rgba(255,200,120,0)" />
              </radialGradient>

              <filter id="grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.14 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>

              <pattern id="dots" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.16)" />
              </pattern>
            </defs>

            <rect width="1100" height="720" fill="url(#cover-bg)" />
            <rect width="1100" height="720" fill="url(#cover-glow)" />
            <rect width="1100" height="720" fill="url(#dots)" opacity="0.55" />
            <rect width="1100" height="720" filter="url(#grain)" />

            {/*
             * Cocoa pods silhouettes intentionally removed at v2: the
             * ellipse-with-vertical-strokes shape was reading as a
             * generic “design circle” behind the bottom info card and
             * the user asked for a cleaner cover. The hero now relies on
             * the gradient + glow + dots + grain alone.
             */}

            {/* Soft horizon line */}
            <line x1="0" y1="560" x2="1100" y2="560" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          </svg>
        </div>

        {/* Foreground content */}
        <div style={contentWrap}>
          {/* Top brand strip */}
          <div style={topStrip}>
            <div style={brandBlock}>
              {/*
               * Real Asondo logo, loaded from /public via the dev /
               * prod Next.js server. Width is fixed; height auto so
               * the PNG keeps its proportions.
               */}
              <img
                src="/asondologocomplet.PNG"
                alt="Asondo"
                style={brandLogo}
              />
            </div>
            <div style={topRight}>
              <span style={topRightLabel}>{content.versionLabel}</span>
              <span style={topRightValue}>{version}</span>
            </div>
          </div>

          {/* Title block */}
          <div style={titleBlock}>
            <div style={eyebrow}>{content.confidential}</div>
            <h1 className="pdf-display" style={titleStyle}>
              {content.title}
            </h1>
            <div style={subtitleStyle}>{content.subtitle}</div>
          </div>

          {/* Bottom info card */}
          <div style={bottomCard}>
            <div style={bottomCardRow}>
              <div style={bottomCardCol}>
                <div style={miniLabel}>{content.preparedFor(undefined).split(" ")[0]}</div>
                <div style={miniValue}>{content.preparedFor(buyer)}</div>
              </div>
              <div style={bottomCardCol}>
                <div style={miniLabel}>{content.issuedOn}</div>
                <div style={miniValue}>{issuedDate}</div>
              </div>
            </div>

            <div style={ruleStyle} />

            <div style={bottomCardRow}>
              <div style={ccBlock}>
                {/* Côte d'Ivoire flag block */}
                <div style={flagBlock}>
                  <span style={{ ...flagBand, background: "#F77F00" }} />
                  <span style={{ ...flagBand, background: "#FFFFFF" }} />
                  <span style={{ ...flagBand, background: "#009E60" }} />
                </div>
                <div>
                  <div style={miniLabel}>{content.licenceLabel}</div>
                  <div style={miniValue}>{licenceLine}</div>
                </div>
              </div>
              <div style={legalCorner}>{legalFooter}</div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ---- inline styles (cover only, the rest uses styles.css) -------------- */

const coverWrap: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "210mm",
  height: "297mm",
  overflow: "hidden",
  background: "#8a2f0c",
};

const heroWrap: React.CSSProperties = {
  position: "absolute",
  inset: 0,
};

const contentWrap: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  padding: "18mm 16mm 16mm 16mm",
  display: "flex",
  flexDirection: "column",
  // No more `space-between`: the title block now sits right under the
  // top brand strip (per user request to remonter the title in haut de
  // page) and the bottom info card is kept at the bottom of the page
  // by its own `marginTop: "auto"`.
  color: "#fdfbf7",
};

const topStrip: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const brandBlock: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "3mm",
};

const brandLogo: React.CSSProperties = {
  height: "14mm",
  width: "auto",
  display: "block",
  /*
   * Drop shadow keeps the logo legible over the warm orange band even
   * when the PNG includes near-white strokes.
   */
  filter: "drop-shadow(0 1.2mm 1.2mm rgba(0,0,0,0.18))",
};

const topRight: React.CSSProperties = {
  textAlign: "right",
  display: "flex",
  flexDirection: "column",
  gap: "0.6mm",
};

const topRightLabel: React.CSSProperties = {
  fontSize: "7.5pt",
  fontWeight: 600,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(253,251,247,0.65)",
};

const topRightValue: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontSize: "13pt",
  fontWeight: 600,
  color: "#f2b83e",
  letterSpacing: "0.04em",
};

const titleBlock: React.CSSProperties = {
  /*
   * Title block sits right under the top brand strip (cover hero
   * top). The small marginTop opens a breath after the brand strip
   * without re-centering the title in the middle of the page.
   */
  marginTop: "12mm",
};

const eyebrow: React.CSSProperties = {
  fontSize: "8.5pt",
  fontWeight: 600,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#f2b83e",
  marginBottom: "6mm",
};

const titleStyle: React.CSSProperties = {
  color: "#fdfbf7",
  fontSize: "54pt",
  lineHeight: 1.02,
  marginBottom: "5mm",
  textShadow: "0 2px 14px rgba(60,18,0,0.32)",
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontSize: "13pt",
  fontWeight: 500,
  color: "rgba(253,251,247,0.92)",
  letterSpacing: "0.01em",
  maxWidth: "150mm",
};

const bottomCard: React.CSSProperties = {
  /*
   * Deep-cocoa translucent panel reads well over the warm orange
   * background; gold border + soft drop shadow give it weight.
   * `marginTop: auto` keeps it pinned at the very bottom of the cover
   * now that the title block no longer uses space-between.
   */
  marginTop: "auto",
  background: "rgba(74, 25, 8, 0.72)",
  border: "0.3mm solid rgba(255, 220, 150, 0.45)",
  borderRadius: "2.5mm",
  padding: "6mm 7mm",
  boxShadow: "0 4mm 12mm rgba(60, 18, 0, 0.25)",
  backdropFilter: "blur(4px)",
};

const bottomCardRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8mm",
};

const bottomCardCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1mm",
  flex: "1 1 0",
};

const miniLabel: React.CSSProperties = {
  fontSize: "7pt",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(253,251,247,0.55)",
};

const miniValue: React.CSSProperties = {
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontSize: "10.5pt",
  fontWeight: 500,
  color: "#fdfbf7",
};

const ruleStyle: React.CSSProperties = {
  height: "0.3mm",
  background: "rgba(242,184,62,0.3)",
  margin: "5mm 0",
};

const ccBlock: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4mm",
};

const flagBlock: React.CSSProperties = {
  width: "12mm",
  height: "8mm",
  display: "flex",
  borderRadius: "0.6mm",
  overflow: "hidden",
  boxShadow: "0 0 0 0.2mm rgba(255,255,255,0.4)",
};

const flagBand: React.CSSProperties = {
  flex: "1 1 0",
  height: "100%",
};

const legalCorner: React.CSSProperties = {
  fontSize: "7pt",
  lineHeight: 1.35,
  color: "rgba(253,251,247,0.55)",
  textAlign: "right",
  maxWidth: "82mm",
};
