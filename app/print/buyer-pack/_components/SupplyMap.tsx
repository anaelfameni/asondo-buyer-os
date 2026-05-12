/**
 * P3 — Supply Network Map.
 *
 * Custom inline SVG of Côte d'Ivoire (simplified silhouette, deliberately
 * stylised — not a survey-grade boundary). Three sourcing zone pins,
 * one HQ pin in Abidjan. Right rail lists zones + criteria.
 */

import type { PdfContent } from "@/lib/pdf-content";
import { Page } from "./shared";

interface SupplyMapProps {
  content: PdfContent["supply"];
  legalFooter: string;
  number: number;
  total: number;
  taglineCenter: string;
  pageRef: string;
  zones: { name: string; description: string; coopCount: number }[];
}

export function SupplyMap({
  content,
  legalFooter,
  number,
  total,
  taglineCenter,
  pageRef,
  zones,
}: SupplyMapProps) {
  return (
    <Page
      number={number}
      total={total}
      taglineCenter={taglineCenter}
      pageRef={pageRef}
      legalFooter={legalFooter}
      variant="cream"
    >
      <div className="pdf-spacer-md" />
      <div className="pdf-eyebrow">{content.eyebrow}</div>
      <h1 className="pdf-h1">{content.title}</h1>
      <div className="pdf-spacer-sm" />
      <p className="pdf-body pdf-body--muted" style={{ maxWidth: "165mm" }}>
        {content.intro}
      </p>

      <div className="pdf-spacer-md" />

      <div
        style={{
          display: "grid",
          /*
           * 11fr / 9fr keeps the visual ~55/45 split we want between
           * the map (left) and the rail (right). Switching from
           * percentages (`55% 45%`) to fr units is intentional: with
           * `gap: 6mm`, percentages sum to 100% of the container and
           * the gap is then ADDED on top, pushing the right rail
           * 6mm past the inner padding and clipping the "Bassins de
           * sourcing" cards + criteria panel off the right edge of
           * page 4 (the "partie coupée" bug reported on the PDF).
           * `fr` units, by contrast, distribute the leftover space
           * AFTER the gap, so the rail fits within the printable
           * area whatever the page padding is.
           */
          gridTemplateColumns: "11fr 9fr",
          gap: "6mm",
          flex: "1 1 0",
          minHeight: 0,
        }}
      >
        {/* Map */}
        <div
          style={{
            background: "#fff",
            border: "0.3mm solid #ece6d8",
            borderRadius: "2.5mm",
            padding: "5mm",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CoteDivoireMap />
          <div
            style={{
              fontSize: "7.5pt",
              color: "#6b7280",
              fontStyle: "italic",
              marginTop: "3mm",
              lineHeight: 1.4,
            }}
          >
            {content.ndaNote}
          </div>
        </div>

        {/* Right rail: zones + criteria */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5mm" }}>
          <div>
            <div className="pdf-eyebrow" style={{ color: "#1f3d2f", marginBottom: "3mm" }}>
              {content.zonesLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5mm" }}>
              {zones.map((zone, i) => (
                <ZoneRow
                  key={i}
                  index={i + 1}
                  name={zone.name}
                  description={zone.description}
                  coopLabel={content.coopsLabel(zone.coopCount)}
                />
              ))}
            </div>
          </div>

          <div className="pdf-card pdf-card--orange">
            <div className="pdf-eyebrow" style={{ color: "#1f3d2f", marginBottom: "2.5mm" }}>
              {content.criteriaTitle}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1.6mm" }}>
              {content.criteria.map((c, i) => (
                <li
                  key={i}
                  style={{
                    position: "relative",
                    paddingLeft: "5mm",
                    fontSize: "9pt",
                    lineHeight: 1.4,
                    color: "#1a1a1a",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "1.4mm",
                      width: "1.4mm",
                      height: "1.4mm",
                      borderRadius: "50%",
                      background: "#d06b1f",
                    }}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ---- Côte d'Ivoire stylised silhouette ----------------------------- */

function CoteDivoireMap() {
  // Three sourcing zones approximate centroids on the SVG canvas
  const zoneCenters = [
    { id: "central", cx: 510, cy: 360, label: "Central" },
    { id: "eastern", cx: 660, cy: 380, label: "Eastern" },
    { id: "western", cx: 350, cy: 410, label: "Western" },
  ];
  const hq = { cx: 540, cy: 590, label: "Abidjan" };

  return (
    <svg
      viewBox="0 0 880 660"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%", display: "block", flex: "1 1 0", minHeight: 0 }}
      aria-label="Côte d'Ivoire sourcing map"
    >
      <defs>
        <linearGradient id="map-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="100%" stopColor="#f4efe2" />
        </linearGradient>
        <linearGradient id="map-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f3d2f" />
          <stop offset="100%" stopColor="#0f2619" />
        </linearGradient>
        <radialGradient id="zone-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(208,107,31,0.45)" />
          <stop offset="100%" stopColor="rgba(208,107,31,0)" />
        </radialGradient>
        <pattern id="map-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(31,61,47,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width="880" height="660" fill="url(#map-bg)" />
      <rect width="880" height="660" fill="url(#map-grid)" />

      {/* Country silhouette — stylised, not survey-grade */}
      <path
        d="
          M 200 170
          C 210 130 260 110 320 115
          C 380 120 420 100 480 105
          C 540 110 600 100 660 120
          C 720 140 740 200 745 270
          C 750 340 730 400 715 460
          C 700 510 680 570 640 600
          C 580 640 500 645 440 635
          C 380 625 300 605 250 565
          C 200 525 175 470 165 400
          C 155 330 175 240 200 170
          Z
        "
        fill="url(#map-fill)"
        stroke="#0f2619"
        strokeWidth="2"
      />

      {/* Country label */}
      <text
        x="440"
        y="240"
        textAnchor="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="22"
        fontWeight="600"
        fill="rgba(242,184,62,0.85)"
        letterSpacing="3"
      >
        CÔTE D&apos;IVOIRE
      </text>

      {/* Sourcing zones */}
      {zoneCenters.map((z) => (
        <g key={z.id}>
          <circle cx={z.cx} cy={z.cy} r="48" fill="url(#zone-glow)" />
          <circle
            cx={z.cx}
            cy={z.cy}
            r="14"
            fill="#d06b1f"
            stroke="#fdfbf7"
            strokeWidth="2.5"
          />
          <circle cx={z.cx} cy={z.cy} r="6" fill="#f2b83e" />
          <text
            x={z.cx}
            y={z.cy + 32}
            textAnchor="middle"
            fontFamily="var(--font-inter), system-ui, sans-serif"
            fontSize="11"
            fontWeight="600"
            fill="#fdfbf7"
            letterSpacing="1.2"
          >
            {z.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Headquarters Abidjan */}
      <g>
        <circle cx={hq.cx} cy={hq.cy} r="36" fill="rgba(242,184,62,0.18)" />
        <circle cx={hq.cx} cy={hq.cy} r="20" fill="rgba(242,184,62,0.32)" />
        <rect x={hq.cx - 8} y={hq.cy - 8} width="16" height="16" rx="2" fill="#f2b83e" stroke="#1f3d2f" strokeWidth="1.5" />
        <text
          x={hq.cx}
          y={hq.cy + 56}
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="13"
          fontWeight="700"
          fill="#1f3d2f"
        >
          ABIDJAN
        </text>
        <text
          x={hq.cx}
          y={hq.cy + 72}
          textAnchor="middle"
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontSize="9"
          fontWeight="500"
          fill="#6b7280"
        >
          Headquarters · Treichville
        </text>
      </g>

      {/* Compass rose */}
      <g transform="translate(800 80)">
        <circle r="22" fill="#fff" stroke="#d06b1f" strokeWidth="1" />
        <path d="M 0 -16 L 4 0 L 0 16 L -4 0 Z" fill="#d06b1f" />
        <text y="-26" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1f3d2f">
          N
        </text>
      </g>
    </svg>
  );
}

function ZoneRow({
  index,
  name,
  description,
  coopLabel,
}: {
  index: number;
  name: string;
  description: string;
  coopLabel: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "8mm 1fr",
        alignItems: "start",
        gap: "3mm",
        padding: "3mm 4mm",
        background: "#fff",
        border: "0.3mm solid #ece6d8",
        borderRadius: "2mm",
      }}
    >
      <div
        style={{
          width: "7mm",
          height: "7mm",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d06b1f, #b85814)",
          color: "#fdfbf7",
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 700,
          fontSize: "10pt",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {index}
      </div>
      <div>
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "10pt",
            color: "#1f3d2f",
            lineHeight: 1.25,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: "8.5pt",
            color: "#4b5563",
            lineHeight: 1.3,
            marginTop: "0.6mm",
          }}
        >
          {description}
        </div>
        <div
          style={{
            fontSize: "8pt",
            fontWeight: 600,
            color: "#d06b1f",
            marginTop: "1mm",
            letterSpacing: "0.04em",
          }}
        >
          {coopLabel}
        </div>
      </div>
    </div>
  );
}
