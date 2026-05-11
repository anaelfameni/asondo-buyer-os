/**
 * P2 — EUDR Evidence Matrix.
 *
 * 4 PillarCard arranged 2x2, with a top summary banner showing:
 *   - X / 4 pillars compliant
 *   - Y total commitments
 *   - global readiness label (Ready / Almost Ready / Not Ready)
 */

import type { PdfContent } from "@/lib/pdf-content";
import { asondoData, type EudrStatus } from "@/lib/asondo-data";
import { computeReadiness, type ReadinessFlags, READINESS_THEME } from "@/lib/readiness-score";
import {
  Page,
  PillarCard,
  StatBlock,
  type EvidenceStatus,
  type PillarKind,
} from "./shared";
import type { PdfLocale } from "@/lib/pdf-content";
import { translations } from "@/lib/translations";

interface EvidenceMatrixProps {
  content: PdfContent["evidence"];
  legalFooter: string;
  number: number;
  total: number;
  taglineCenter: string;
  pageRef: string;
  flags: ReadinessFlags;
  lang: PdfLocale;
}

const PILLAR_ORDER: { id: PillarKind; dataId: string }[] = [
  { id: "traceability", dataId: "traceability" },
  { id: "restoration", dataId: "restoration" },
  { id: "resilience", dataId: "resilience" },
  { id: "banking", dataId: "banking" },
];

export function EvidenceMatrix({
  content,
  legalFooter,
  number,
  total,
  taglineCenter,
  pageRef,
  flags,
  lang,
}: EvidenceMatrixProps) {
  const readiness = computeReadiness(flags);
  const tPillars = translations[lang].evidence.pillars;

  // Map pillar EUDR status from the data layer to badge variant.
  const statusMap: Record<EudrStatus, EvidenceStatus> = {
    ready: "ready",
    "almost-ready": "almost",
    "not-ready": "not",
    na: "na",
  };

  const statusLabelMap: Record<EvidenceStatus, string> = {
    ready: content.statusLabels.ready,
    almost: content.statusLabels.almost,
    not: content.statusLabels.not,
    na: content.statusLabels.na,
  };

  const pillars = asondoData.pillars;
  const compliantCount = pillars.filter((p) => p.eudrStatus === "ready").length;
  const totalItems = pillars.reduce((acc, p) => acc + p.items.length, 0);
  const readinessLevel = readiness.level;
  const readinessTheme = READINESS_THEME[readinessLevel];
  const readinessLabel = lang === "fr" ? readinessTheme.labelFr : readinessTheme.labelEn;

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

      {/* Summary banner */}
      <div style={{ display: "flex", gap: "3mm" }}>
        <StatBlock
          value={`${compliantCount} / ${pillars.length}`}
          label={content.summaryLabels.pillarsCompliant}
        />
        <StatBlock
          value={String(totalItems)}
          label={content.summaryLabels.itemsTotal}
        />
        <div
          className="pdf-statblock"
          style={{
            background: readinessTheme.bg,
            borderColor: readinessTheme.ring,
            color: readinessTheme.color,
          }}
        >
          <div
            className="pdf-statblock__value"
            style={{ color: readinessTheme.color, fontSize: "20pt" }}
          >
            {readinessLabel}
          </div>
          <div className="pdf-statblock__label">
            {content.summaryLabels.readinessLevel}
          </div>
        </div>
      </div>

      <div className="pdf-spacer-md" />

      {/* 2 x 2 pillar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "4mm",
          flex: "1 1 0",
        }}
      >
        {PILLAR_ORDER.map(({ id, dataId }) => {
          const data = pillars.find((p) => p.id === dataId);
          if (!data) return null;
          const localizedItems =
            tPillars[dataId as keyof typeof tPillars]?.items ?? data.items;
          const status = statusMap[data.eudrStatus];
          return (
            <PillarCard
              key={id}
              kind={id}
              title={tPillars[dataId as keyof typeof tPillars]?.name ?? data.name}
              items={localizedItems}
              status={status}
              statusLabel={statusLabelMap[status]}
            />
          );
        })}
      </div>

      <div className="pdf-spacer-sm" />
      <div
        style={{
          fontSize: "8pt",
          fontStyle: "italic",
          color: "#6b7280",
          padding: "2mm 0",
          borderTop: "0.2mm solid #ece6d8",
          marginTop: "2mm",
        }}
      >
        {content.ndaNote}
      </div>
    </Page>
  );
}
