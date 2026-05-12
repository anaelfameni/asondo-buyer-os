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
      <div style={{ height: "3mm" }} />
      <div className="pdf-eyebrow">{content.eyebrow}</div>
      <h1 className="pdf-h1" style={{ fontSize: "24pt", lineHeight: 1.1 }}>
        {content.title}
      </h1>
      <div style={{ height: "2mm" }} />
      <p
        className="pdf-body pdf-body--muted"
        style={{ maxWidth: "170mm", fontSize: "9pt", lineHeight: 1.45 }}
      >
        {content.intro}
      </p>

      <div style={{ height: "3mm" }} />

      {/* Grievance mechanism card */}
      <div
        className="pdf-card pdf-card--green"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "4mm",
          padding: "4mm 5mm",
        }}
      >
        <GrievanceIcon />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.6mm" }}>
          <div
            style={{
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "11pt",
              fontWeight: 600,
              color: "#1f3d2f",
            }}
          >
            {content.grievanceTitle}
          </div>
          <div style={{ fontSize: "8.5pt", lineHeight: 1.45, color: "#1a1a1a" }}>
            {content.grievanceChannels}
          </div>
          <div
            style={{
              fontSize: "8.5pt",
              lineHeight: 1.45,
              color: "#1a1a1a",
              fontWeight: 500,
            }}
          >
            {content.grievanceSla}
          </div>
          <div
            style={{
              fontSize: "8pt",
              fontStyle: "italic",
              color: "#4b5563",
              borderLeft: "0.6mm solid #d06b1f",
              paddingLeft: "2.5mm",
              marginTop: "0.5mm",
              lineHeight: 1.4,
            }}
          >
            {content.grievanceStats}
          </div>
        </div>
      </div>

      <div style={{ height: "3mm" }} />

      {/* Code of conduct grid */}
      <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
        {content.codeTitle}
      </div>
      <div style={{ height: "2mm" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2.5mm",
        }}
      >
        {content.codeItems.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "0.3mm solid #ece6d8",
              borderRadius: "2mm",
              padding: "3mm 3.5mm",
              display: "flex",
              flexDirection: "column",
              gap: "1.2mm",
              breakInside: "avoid",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
              <div
                style={{
                  width: "5mm",
                  height: "5mm",
                  borderRadius: "1.2mm",
                  background: "linear-gradient(135deg, #d06b1f, #b85814)",
                  color: "#fdfbf7",
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontWeight: 700,
                  fontSize: "8pt",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "9pt",
                  fontWeight: 600,
                  color: "#1f3d2f",
                  lineHeight: 1.25,
                  flex: "1 1 0",
                }}
              >
                {item.title}
              </div>
            </div>
            <div style={{ fontSize: "7.5pt", lineHeight: 1.4, color: "#4b5563" }}>
              {item.body}
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory mapping table — pushed to the bottom of the body via
          marginTop:auto, with a generous marginBottom safety margin so
          the four rows never collide with the "ASONDO SA · …" legal
          footer. The body has `overflow: hidden` as a last-line defense
          (see styles.css). */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "3mm",
          marginBottom: "2mm",
        }}
      >
        <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
          {content.mappingTitle}
        </div>
        <div style={{ height: "1.5mm" }} />

        <table
          className="pdf-mapping"
          style={{ fontSize: "7.5pt" }}
        >
          <tbody>
            {content.mappingRows.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "1.3mm 3mm" }}>{row.framework}</td>
                <td style={{ padding: "1.3mm 3mm", color: "#4b5563" }}>
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
