/**
 * Shared primitives for the Buyer Assurance Pack PDF.
 *
 * All components are pure presentational React, server-side rendered,
 * styled exclusively through `app/print/buyer-pack/styles.css`. They
 * intentionally avoid Tailwind / framer-motion / lucide-react runtime
 * (icons are inline SVG) so Puppeteer can render them deterministically
 * with no extra runtime cost.
 */

import type { ReactNode } from "react";
import type { PdfContent, PdfLocale } from "@/lib/pdf-content";

/* ----------------------------------------------------------------- Page */

interface PageProps {
  children: ReactNode;
  number?: number;
  total?: number;
  taglineCenter?: string;
  pageRef?: string;
  variant?: "cream" | "white";
  watermark?: string;
  legalFooter?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  /**
   * When true, the inner wrapper drops its 18 mm × 16 mm padding so the
   * child content can paint edge-to-edge (used by the Cover for the full
   * bleed orange hero illustration).
   */
  fullbleed?: boolean;
}

export function Page({
  children,
  number,
  total,
  taglineCenter,
  pageRef,
  variant = "cream",
  watermark,
  legalFooter,
  hideHeader,
  hideFooter,
  fullbleed,
}: PageProps) {
  return (
    <section className={`pdf-page pdf-page--${variant}`}>
      {watermark ? (
        <div className="pdf-watermark" aria-hidden>
          <span className="pdf-watermark__text">{watermark}</span>
        </div>
      ) : null}
      <div
        className={`pdf-page__inner${
          fullbleed ? " pdf-page__inner--fullbleed" : ""
        }`}
      >
        {hideHeader ? null : (
          <PageHeader
            number={number}
            total={total}
            taglineCenter={taglineCenter}
          />
        )}
        <div className="pdf-page__body">{children}</div>
        {hideFooter ? null : <PageFooter pageRef={pageRef} legal={legalFooter} />}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- PageHeader */

function PageHeader({
  number,
  total,
  taglineCenter,
}: {
  number?: number;
  total?: number;
  taglineCenter?: string;
}) {
  return (
    <header className="pdf-pageheader">
      <div className="pdf-pageheader__brand">
        <div className="pdf-pageheader__logomark">A</div>
        <div className="pdf-pageheader__name">Asondo</div>
      </div>
      <div className="pdf-pageheader__tagline">
        {taglineCenter ?? "Buyer Assurance Pack"}
      </div>
      <div className="pdf-pageheader__pagenum">
        {number !== undefined && total !== undefined
          ? `${pad2(number)} / ${pad2(total)}`
          : ""}
      </div>
    </header>
  );
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/* ----------------------------------------------------------- PageFooter */

/**
 * Two-row footer to avoid the long legal-notice / pageRef overlap that
 * was visible on pages 3 and 6 of the first PDF export.
 *
 *   row 1 : full legal notice (wraps if needed, up to 2 lines)
 *   row 2 : compact meta — HQ line (left) + document reference (right)
 */
function PageFooter({
  pageRef,
  legal,
}: {
  pageRef?: string;
  legal?: string;
}) {
  return (
    <footer className="pdf-pagefooter">
      {legal ? <div className="pdf-pagefooter__legal">{legal}</div> : null}
      <div className="pdf-pagefooter__meta">
        <span className="pdf-pagefooter__hq">
          asondo.ci · Treichville, Abidjan
        </span>
        <span className="pdf-pagefooter__ref">
          {pageRef ?? "Buyer Assurance Pack"}
        </span>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------- EvidenceBadge */

export type EvidenceStatus = "ready" | "almost" | "not" | "na";

export function EvidenceBadge({
  status,
  label,
}: {
  status: EvidenceStatus;
  label: string;
}) {
  return (
    <span className={`pdf-badge pdf-badge--${status}`}>
      <span className="pdf-badge__dot" />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------ StatBlock */

export function StatBlock({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className={`pdf-statblock${accent ? " pdf-statblock--accent" : ""}`}>
      <div className="pdf-statblock__value">{value}</div>
      <div className="pdf-statblock__label">{label}</div>
    </div>
  );
}

/* --------------------------------------------------------- PillarIcon SVG */

export type PillarKind = "traceability" | "restoration" | "resilience" | "banking";

export function PillarIcon({ kind }: { kind: PillarKind }) {
  // Inline SVG, derived from lucide-react MapPin / TreePine / TrendingUp /
  // Wallet shapes but simplified for tiny print sizes.
  const stroke = "#1f3d2f";
  const sw = 1.6;
  switch (kind) {
    case "traceability":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "restoration":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V8" />
          <path d="M5 16 12 9l7 7" />
          <path d="M5 11 12 4l7 7" />
        </svg>
      );
    case "resilience":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17 9 11l4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case "banking":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
          <path d="M16 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          <path d="M3 9V7a2 2 0 0 1 2-2h12" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------ PillarCard */

interface PillarCardProps {
  kind: PillarKind;
  title: string;
  items: string[];
  status: EvidenceStatus;
  statusLabel: string;
}

export function PillarCard({
  kind,
  title,
  items,
  status,
  statusLabel,
}: PillarCardProps) {
  return (
    <div className="pdf-pillar">
      <div className="pdf-pillar__head">
        <div className="pdf-pillar__title">
          <span className="pdf-pillar__icon">
            <PillarIcon kind={kind} />
          </span>
          {title}
        </div>
        <EvidenceBadge status={status} label={statusLabel} />
      </div>
      <ul className="pdf-pillar__items">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------- Locale helper for I18n */

export function pickContent<T>(
  content: Record<PdfLocale, T>,
  lang: PdfLocale
): T {
  return content[lang];
}

export type { PdfContent, PdfLocale };
