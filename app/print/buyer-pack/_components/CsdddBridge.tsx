/**
 * P5 — CSDDD Bridge.
 *
 * Top: grievance mechanism card (channels, SLA, baseline stats).
 * Middle: 5 code-of-conduct commitments in a 2-col grid (3+2).
 * Bottom: regulatory mapping table.
 * CONFIDENTIAL watermark.
 */

import type { PdfContent } from "@/lib/pdf-content";
import { Page } from "./shared";

interface CsdddBridgeProps {
  content: PdfContent["csddd"];
  legalFooter: string;
  number: number;
  total: number;
  taglineCenter: string;
  pageRef: string;
  watermarkText: string;
}

export function CsdddBridge({
  content,
  legalFooter,
  number,
  total,
  taglineCenter,
  pageRef,
  watermarkText,
}: CsdddBridgeProps) {
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

      <div className="pdf-spacer-sm" />

      {/* Grievance mechanism card */}
      <div
        className="pdf-card pdf-card--green"
        style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "5mm" }}
      >
        <GrievanceIcon />
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5mm" }}>
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "12pt",
              fontWeight: 600,
              color: "#1f3d2f",
            }}
          >
            {content.grievanceTitle}
          </div>
          <div style={{ fontSize: "9pt", lineHeight: 1.5, color: "#1a1a1a" }}>
            {content.grievanceChannels}
          </div>
          <div
            style={{
              fontSize: "9pt",
              lineHeight: 1.5,
              color: "#1a1a1a",
              fontWeight: 500,
            }}
          >
            {content.grievanceSla}
          </div>
          <div
            style={{
              fontSize: "8.5pt",
              fontStyle: "italic",
              color: "#4b5563",
              borderLeft: "0.6mm solid #d06b1f",
              paddingLeft: "3mm",
              marginTop: "1mm",
            }}
          >
            {content.grievanceStats}
          </div>
        </div>
      </div>

      <div className="pdf-spacer-sm" />

      {/* Code of conduct grid */}
      <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
        {content.codeTitle}
      </div>
      <div className="pdf-spacer-sm" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3mm",
        }}
      >
        {content.codeItems.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "0.3mm solid #ece6d8",
              borderRadius: "2mm",
              padding: "4mm",
              display: "flex",
              flexDirection: "column",
              gap: "1.6mm",
              breakInside: "avoid",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "2.5mm" }}>
              <div
                style={{
                  width: "6mm",
                  height: "6mm",
                  borderRadius: "1.4mm",
                  background: "linear-gradient(135deg, #d06b1f, #b85814)",
                  color: "#fdfbf7",
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontWeight: 700,
                  fontSize: "9pt",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "10pt",
                  fontWeight: 600,
                  color: "#1f3d2f",
                  lineHeight: 1.25,
                  flex: "1 1 0",
                }}
              >
                {item.title}
              </div>
            </div>
            <div style={{ fontSize: "8.5pt", lineHeight: 1.45, color: "#4b5563" }}>
              {item.body}
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory mapping table — wrapped in a flex `marginTop: auto`
          container so it pushes to the bottom of the page body and a
          fixed margin-bottom keeps it from kissing the legal footer.
          Type-scale is also slightly compressed so the four rows always
          fit without overlapping the closing footer block. */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "4mm",
          marginBottom: "3mm",
        }}
      >
        <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
          {content.mappingTitle}
        </div>
        <div style={{ height: "2mm" }} />

        <table
          className="pdf-mapping"
          style={{ fontSize: "8pt" }}
        >
          <tbody>
            {content.mappingRows.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "1.6mm 3mm" }}>{row.framework}</td>
                <td style={{ padding: "1.6mm 3mm", color: "#4b5563" }}>
                  {row.coverage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

function GrievanceIcon() {
  return (
    <div
      style={{
        width: "16mm",
        height: "16mm",
        borderRadius: "2.5mm",
        background: "linear-gradient(155deg, #1f3d2f, #0f2619)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f2b83e"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M9 9h6" />
        <path d="M9 13h4" />
      </svg>
    </div>
  );
}
