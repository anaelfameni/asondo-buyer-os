/**
 * P4 — Certifications & Chain of Custody.
 *
 * Top: 3 certification status cards (CCC active, SNTCC, Rainforest).
 * Middle: full-width chain-of-custody horizontal diagram with 5 steps.
 * Bottom: caption + NDA reminder.
 * CONFIDENTIAL watermark applied.
 */

import type { PdfContent } from "@/lib/pdf-content";
import type { ConsoleSettings } from "@/lib/settings-store";
import { Page } from "./shared";

interface CertChainProps {
  content: PdfContent["cert"];
  legalFooter: string;
  number: number;
  total: number;
  taglineCenter: string;
  pageRef: string;
  settings: ConsoleSettings;
  watermarkText: string;
}

export function CertChain({
  content,
  legalFooter,
  number,
  total,
  taglineCenter,
  pageRef,
  settings,
  watermarkText,
}: CertChainProps) {
  const cccLabel = settings.certificates.cccLicenceActive
    ? content.licenceCccActive
    : content.licenceCccPending;

  const rfLabel =
    content.rainforestStatus[settings.certificates.rainforestStatus];

  return (
    <Page
      number={number}
      total={total}
      taglineCenter={taglineCenter}
      pageRef={pageRef}
      legalFooter={legalFooter}
      variant="cream"
      watermark={watermarkText}
    >
      <div className="pdf-spacer-md" />
      <div className="pdf-eyebrow">{content.eyebrow}</div>
      <h1 className="pdf-h1">{content.title}</h1>
      <div className="pdf-spacer-sm" />
      <p className="pdf-body pdf-body--muted" style={{ maxWidth: "165mm" }}>
        {content.intro}
      </p>

      <div className="pdf-spacer-md" />

      {/* Cert cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3mm" }}>
        <CertBadgeCard
          label="CCC 2025/26"
          status={cccLabel}
          variant={settings.certificates.cccLicenceActive ? "active" : "pending"}
          icon="ccc"
        />
        <CertBadgeCard
          label="SNTCC"
          status={content.sntccLabel}
          subtitle={content.sntccDetail}
          variant="pending"
          icon="sntcc"
        />
        <CertBadgeCard
          label="Rainforest Alliance"
          status={rfLabel}
          variant={
            settings.certificates.rainforestStatus === "certified"
              ? "active"
              : settings.certificates.rainforestStatus === "in_progress"
              ? "pending"
              : "inactive"
          }
          icon="rainforest"
        />
      </div>

      <div className="pdf-spacer-lg" />

      {/* Chain of Custody diagram */}
      <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
        {content.chainTitle}
      </div>
      <div className="pdf-spacer-sm" />

      <div className="pdf-coc">
        {content.chainSteps.map((step, i) => {
          const cls =
            i === 0
              ? "pdf-coc__step pdf-coc__step--first"
              : i === content.chainSteps.length - 1
              ? "pdf-coc__step pdf-coc__step--last"
              : "pdf-coc__step";
          return (
            <div key={i} className={cls}>
              <div className="pdf-coc__num">{i + 1}</div>
              <div className="pdf-coc__label">{step.label}</div>
              <div className="pdf-coc__control">{step.control}</div>
              <div className="pdf-coc__doc">{step.doc}</div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}

/* ---- CertBadgeCard ---------------------------------------------------- */

function CertBadgeCard({
  label,
  status,
  subtitle,
  variant,
  icon,
}: {
  label: string;
  status: string;
  subtitle?: string;
  variant: "active" | "pending" | "inactive";
  icon: "ccc" | "sntcc" | "rainforest";
}) {
  const variantStyles: Record<
    typeof variant,
    { bg: string; border: string; tag: string; tagBg: string }
  > = {
    active: { bg: "#f4f6f1", border: "#cdd9c8", tag: "#15803d", tagBg: "#dcfce7" },
    pending: { bg: "#fff5e9", border: "#f4d4ad", tag: "#b45309", tagBg: "#fef3c7" },
    inactive: { bg: "#f3f4f6", border: "#d1d5db", tag: "#6b7280", tagBg: "#e5e7eb" },
  };
  const v = variantStyles[variant];

  return (
    <div
      style={{
        background: v.bg,
        border: `0.3mm solid ${v.border}`,
        borderRadius: "2.5mm",
        padding: "5mm",
        display: "flex",
        flexDirection: "column",
        gap: "3mm",
        minHeight: "38mm",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "3mm" }}>
        <CertIcon kind={icon} />
        <div
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "11pt",
            color: "#1f3d2f",
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          display: "inline-block",
          alignSelf: "flex-start",
          padding: "1mm 3mm",
          background: v.tagBg,
          color: v.tag,
          borderRadius: "999px",
          fontSize: "8pt",
          fontWeight: 600,
          letterSpacing: "0.03em",
        }}
      >
        {status}
      </div>

      {subtitle ? (
        <div style={{ fontSize: "8pt", color: "#4b5563", lineHeight: 1.4 }}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

function CertIcon({ kind }: { kind: "ccc" | "sntcc" | "rainforest" }) {
  const size = 28;
  if (kind === "ccc") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "1.6mm",
          background: "linear-gradient(135deg, #1f3d2f, #0f2619)",
          color: "#f2b83e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 700,
          fontSize: "10pt",
        }}
      >
        CCC
      </div>
    );
  }
  if (kind === "sntcc") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1f3d2f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 11h6" />
        <path d="M9 15h4" />
        <circle cx="8" cy="8" r="1.4" fill="#1f3d2f" />
      </svg>
    );
  }
  // rainforest
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L17 9 L14 9 L19 16 L13 16 L13 22 L11 22 L11 16 L5 16 L10 9 L7 9 Z" fill="#dcfce7" />
    </svg>
  );
}
