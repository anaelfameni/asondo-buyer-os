/**
 * P6 — Closing & Next Steps.
 *
 * Top: 3-step engagement timeline.
 * Bottom: 2-column footer block — left = QR code + URL, right = CEO
 *         contact card with placeholder signature line.
 *
 * The QR code SVG is generated upstream by `lib/qr.ts` (server-side
 * via the `qrcode` package) and passed as a stringified <svg>.
 */

import type { PdfContent } from "@/lib/pdf-content";
import { Page } from "./shared";

interface ClosingProps {
  content: PdfContent["closing"];
  legalFooter: string;
  number: number;
  total: number;
  taglineCenter: string;
  pageRef: string;
  qrSvgString: string;
  qrTargetUrl: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export function Closing({
  content,
  legalFooter,
  number,
  total,
  taglineCenter,
  pageRef,
  qrSvgString,
  qrTargetUrl,
  contactName,
  contactEmail,
  contactPhone,
}: ClosingProps) {
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

      {/* 3-step list */}
      <div className="pdf-eyebrow" style={{ color: "#1f3d2f" }}>
        {content.stepsTitle}
      </div>
      <div className="pdf-spacer-sm" />

      <div className="pdf-step-list">
        {content.steps.map((step) => (
          <div key={step.num} className="pdf-step">
            <div className="pdf-step__num">{step.num}</div>
            <div>
              <h3 className="pdf-step__title">{step.title}</h3>
              <p className="pdf-step__body">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pdf-spacer-lg" />

      {/* Bottom dual block: QR + Contact card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "55mm 1fr",
          gap: "8mm",
          marginTop: "auto",
          paddingTop: "10mm",
          borderTop: "0.3mm solid #ece6d8",
        }}
      >
        {/* QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2mm" }}>
          <div
            style={{
              width: "44mm",
              height: "44mm",
              padding: "3mm",
              background: "#ffffff",
              border: "0.3mm solid #ece6d8",
              borderRadius: "2mm",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            dangerouslySetInnerHTML={{ __html: qrSvgString }}
          />
          <div
            style={{
              fontSize: "7.5pt",
              fontWeight: 500,
              color: "#6b7280",
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: "50mm",
            }}
          >
            {content.qrCaption}
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "7pt",
              color: "#1f3d2f",
              wordBreak: "break-all",
              textAlign: "center",
              maxWidth: "55mm",
            }}
          >
            {qrTargetUrl}
          </div>
        </div>

        {/* Contact card + signature */}
        <div
          style={{
            background: "#fff",
            border: "0.3mm solid #ece6d8",
            borderRadius: "2.5mm",
            padding: "6mm 7mm",
            display: "flex",
            flexDirection: "column",
            gap: "3mm",
          }}
        >
          <div className="pdf-eyebrow" style={{ color: "#1f3d2f", margin: 0 }}>
            {content.contactTitle}
          </div>
          <div
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "16pt",
              fontWeight: 600,
              color: "#1a1a1a",
              lineHeight: 1.15,
            }}
          >
            {contactName}
          </div>
          <div style={{ fontSize: "9pt", color: "#4b5563", lineHeight: 1.5 }}>
            <div>
              <strong style={{ color: "#1a1a1a" }}>Email · </strong>
              {contactEmail}
            </div>
            <div>
              <strong style={{ color: "#1a1a1a" }}>Tel · </strong>
              {contactPhone}
            </div>
            <div>
              <strong style={{ color: "#1a1a1a" }}>Web · </strong>asondo.ci
            </div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "5mm" }}>
            <div
              style={{
                height: "16mm",
                borderBottom: "0.3mm solid #1a1a1a",
                position: "relative",
              }}
            >
              {/* Stylised signature placeholder — host can replace with PNG */}
              <SignatureScribble />
            </div>
            <div
              style={{
                fontSize: "7.5pt",
                color: "#6b7280",
                marginTop: "1.5mm",
                fontStyle: "italic",
              }}
            >
              {content.signatureLabel}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function SignatureScribble() {
  return (
    <svg
      viewBox="0 0 200 50"
      style={{
        position: "absolute",
        bottom: "1mm",
        left: "2mm",
        width: "60mm",
        height: "14mm",
      }}
      aria-hidden
    >
      <path
        d="M 5 35 Q 18 8 30 28 T 60 30 Q 78 18 96 32 T 132 28 Q 148 14 168 28 T 195 26"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path
        d="M 28 38 Q 42 32 60 38 T 120 36"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
