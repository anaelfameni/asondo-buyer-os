/**
 * P1 — Asondo company snapshot.
 *
 * Two-column layout :
 *   left  — datalist (legal form, licence, HQ, leadership, languages,
 *           direct contact) + mission paragraph.
 *   right — mini SVG locator (Treichville pin) + 4 KPI stat blocks.
 */

import type { PdfContent } from "@/lib/pdf-content";
import type { ConsoleSettings } from "@/lib/settings-store";
import { asondoData } from "@/lib/asondo-data";
import { Page, StatBlock } from "./shared";

interface IdentityProps {
  content: PdfContent["identity"];
  legalFooter: string;
  number: number;
  total: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  taglineCenter: string;
  pageRef: string;
  settings: ConsoleSettings;
}

export function Identity({
  content,
  legalFooter,
  number,
  total,
  contactName,
  contactEmail,
  contactPhone,
  taglineCenter,
  pageRef,
  settings,
}: IdentityProps) {
  // Override the GPS coverage stat with the live console value.
  const statsWithCoverage = [
    content.stats[0],
    content.stats[1],
    content.stats[2],
    {
      value: `${Math.round(settings.geolocation.coveragePct)}%`,
      label: content.stats[3].label,
    },
  ];

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

      <div className="pdf-spacer-lg" />

      <div className="pdf-grid-12" style={{ gap: "8mm" }}>
        {/* Left: identity datalist + mission */}
        <div style={{ gridColumn: "span 7", display: "flex", flexDirection: "column", gap: "6mm" }}>
          <div className="pdf-card pdf-card--green">
            <dl className="pdf-datalist">
              <dt>{content.legalForm}</dt>
              <dd>ASONDO SA · {asondoData.identity.country}</dd>

              <dt>{content.licence}</dt>
              <dd>{asondoData.identity.licence}</dd>

              <dt>{content.headquarters}</dt>
              <dd>{asondoData.identity.address}</dd>

              <dt>{content.leadership}</dt>
              <dd>
                <div>{contactName}</div>
                <div style={{ color: "#4b5563" }}>Chief Executive Officer</div>
              </dd>

              <dt>{content.languages}</dt>
              <dd>Français · English</dd>

              <dt>{content.contact}</dt>
              <dd>
                <div>{contactEmail}</div>
                <div>{contactPhone}</div>
              </dd>
            </dl>
          </div>

          <div>
            <div className="pdf-eyebrow" style={{ marginBottom: "2.5mm", color: "#1f3d2f" }}>
              Mission
            </div>
            <p className="pdf-body">{content.mission}</p>
          </div>
        </div>

        {/* Right: locator card + stats grid */}
        <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: "5mm" }}>
          <LocatorCard />

          <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
            {content.statsTitle}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3mm" }}>
            {statsWithCoverage.map((stat, i) => (
              <StatBlock
                key={i}
                value={stat.value}
                label={stat.label}
                accent={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* -------------------------------------------------- Mini Treichville map */

function LocatorCard() {
  return (
    <div
      style={{
        position: "relative",
        height: "60mm",
        borderRadius: "2.5mm",
        overflow: "hidden",
        background: "linear-gradient(155deg, #1f3d2f 0%, #0f2619 100%)",
        border: "0.3mm solid #1f3d2f",
        color: "#fdfbf7",
      }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden
      >
        <defs>
          <radialGradient id="locator-glow" cx="55%" cy="55%" r="40%">
            <stop offset="0%" stopColor="rgba(242,184,62,0.55)" />
            <stop offset="100%" stopColor="rgba(242,184,62,0)" />
          </radialGradient>
          <pattern id="locator-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(242,184,62,0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="400" height="300" fill="url(#locator-grid)" />
        <rect width="400" height="300" fill="url(#locator-glow)" />

        {/* Approximate Côte d'Ivoire silhouette */}
        <path
          d="M 80 70 Q 130 50 200 60 Q 280 65 320 95 L 340 160 Q 320 200 290 215 Q 250 240 200 245 Q 140 240 100 215 Q 70 180 70 130 Z"
          fill="rgba(242,184,62,0.14)"
          stroke="rgba(242,184,62,0.4)"
          strokeWidth="1"
        />

        {/* HQ marker (Abidjan/Treichville) */}
        <g transform="translate(230 215)">
          <circle r="22" fill="rgba(208,107,31,0.18)" />
          <circle r="13" fill="rgba(208,107,31,0.32)" />
          <circle r="6" fill="#f2b83e" stroke="#fdfbf7" strokeWidth="1.5" />
        </g>

        {/* Sourcing zones (3 small dots) */}
        <circle cx="180" cy="160" r="4" fill="#f2b83e" opacity="0.85" />
        <circle cx="270" cy="150" r="4" fill="#f2b83e" opacity="0.85" />
        <circle cx="130" cy="170" r="4" fill="#f2b83e" opacity="0.85" />
      </svg>

      <div
        style={{
          position: "absolute",
          left: "5mm",
          top: "5mm",
          fontSize: "7.5pt",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(253,251,247,0.7)",
        }}
      >
        Headquarters
      </div>
      <div
        style={{
          position: "absolute",
          left: "5mm",
          bottom: "5mm",
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: "13pt",
          fontWeight: 600,
          color: "#f2b83e",
          lineHeight: 1.1,
        }}
      >
        Treichville
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "8.5pt",
            fontWeight: 500,
            color: "rgba(253,251,247,0.75)",
            letterSpacing: "0.04em",
            marginTop: "0.5mm",
          }}
        >
          Abidjan · Côte d&apos;Ivoire
        </div>
      </div>
    </div>
  );
}
