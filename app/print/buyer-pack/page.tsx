/**
 * Print orchestrator — `/print/buyer-pack?lang=fr|en&buyer=...&token=...`.
 *
 * Server Component. Reads :
 *   - locale from `?lang` (defaults to en)
 *   - optional buyer slug for cover personalisation (`?buyer=Mars`)
 *   - protection token from `?token` matched against `PRINT_TOKEN`
 *
 * Pulls live evidence + contact + flags from `lib/settings-store.ts` so
 * the PDF state matches the CEO console at print time.
 *
 * Returns 7 stacked `<Page>` sections (Cover, Identity, Evidence,
 * Supply, Cert/COC, CSDDD, Closing). Puppeteer captures the whole
 * document with `printBackground: true` and slices via `@page`.
 */

import { readSettings } from "@/lib/settings-store";
import { PDF_CONTENT, type PdfLocale } from "@/lib/pdf-content";
import { renderQrSvg } from "@/lib/qr";
import { asondoData } from "@/lib/asondo-data";

import { Cover } from "./_components/Cover";
import { Identity } from "./_components/Identity";
import { EvidenceMatrix } from "./_components/EvidenceMatrix";
import { SupplyMap } from "./_components/SupplyMap";
import { CertChain } from "./_components/CertChain";
import { CsdddBridge } from "./_components/CsdddBridge";
import { Closing } from "./_components/Closing";
import { PrintTrigger } from "./_components/PrintTrigger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface SearchParams {
  lang?: string | string[];
  buyer?: string | string[];
  token?: string | string[];
}

export default async function BuyerPackPrintPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // This page is now publicly reachable (no token gate) so the visitor
  // can land on it directly from the home "Télécharger le Sample Pack"
  // CTA, let their own browser render it, then Save-as-PDF via the
  // native print dialog. The route is marked `noindex,nofollow` in
  // `layout.tsx` so it won't appear in search engines. Abuse mitigation
  // is delegated to per-IP rate-limit when the optional lead tracker
  // `/api/buyer-pack-track` is called by the client. The Puppeteer
  // fallback in `/api/buyer-pack` still uses the legacy token gate
  // because it forwards `PRINT_TOKEN` explicitly.

  const lang: PdfLocale = pickFirst(searchParams?.lang) === "fr" ? "fr" : "en";
  const buyer = sanitizeBuyer(pickFirst(searchParams?.buyer));
  const content = PDF_CONTENT[lang];

  const settings = await readSettings();
  const totalPages = 7;
  const issuedDate = new Date().toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );
  const versionLine = `v${new Date().toISOString().slice(0, 7).replace("-", ".")}`;
  const pageRef = buyer
    ? `Asondo BAP · ${buyer} · ${versionLine}`
    : `Asondo BAP · ${versionLine}`;
  const taglineCenter = lang === "fr"
    ? "Buyer Assurance Pack · Confidentiel"
    : "Buyer Assurance Pack · Confidential";

  // Approximate co-op counts per zone (matches PLAN.md sourcing strategy)
  const supplyZones = [
    {
      name: lang === "fr" ? "Zone Centre — Bouaké / Yamoussoukro" : "Central — Bouaké / Yamoussoukro",
      description:
        lang === "fr"
          ? "Bassins du Gôh, Lôh-Djiboua, Marahoué. Coopératives leaders en bonnes pratiques et fermentation contrôlée."
          : "Gôh, Lôh-Djiboua, Marahoué basins. Cooperatives leading on good practice and controlled fermentation.",
      coopCount: 3,
    },
    {
      name: lang === "fr" ? "Zone Est — Abengourou / Aboisso" : "Eastern — Abengourou / Aboisso",
      description:
        lang === "fr"
          ? "Bassins de l'Indénié-Djuablin et du Sud-Comoé. Profil qualité fève haute, plantations matures sous agroforesterie."
          : "Indénié-Djuablin and Sud-Comoé basins. High-grade bean profile, mature plantations under agroforestry.",
      coopCount: 3,
    },
    {
      name: lang === "fr" ? "Zone Ouest — Daloa / San-Pédro" : "Western — Daloa / San-Pédro",
      description:
        lang === "fr"
          ? "Bassin du Haut-Sassandra et port de San-Pédro. Volume principal d'export, logistique optimisée."
          : "Haut-Sassandra basin and San-Pédro port. Main export volume, optimised logistics.",
      coopCount: 4,
    },
  ];

  // QR code → pre-filled RFQ form on the public site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://asondo.ci";
  const qrUrl = buyer
    ? `${baseUrl}/console/rfq?ref=BUYER-${slugify(buyer)}&utm_source=buyer-pack`
    : `${baseUrl}/?utm_source=buyer-pack#rfq`;
  const qrSvgString = await renderQrSvg(qrUrl, { size: 160 });

  const watermarkText = lang === "fr" ? "CONFIDENTIEL" : "CONFIDENTIAL";

  return (
    <main>
      <Cover
        content={content.cover}
        legalFooter={content.common.legalFooter}
        buyer={buyer}
        version={versionLine}
        issuedDate={issuedDate}
        licenceLine={asondoData.identity.licence}
      />

      <Identity
        content={content.identity}
        legalFooter={content.common.legalFooter}
        number={2}
        total={totalPages}
        contactName={settings.contact.name}
        contactEmail={settings.contact.email}
        contactPhone={settings.contact.phone}
        taglineCenter={taglineCenter}
        pageRef={pageRef}
        settings={settings}
      />

      <EvidenceMatrix
        content={content.evidence}
        legalFooter={content.common.legalFooter}
        number={3}
        total={totalPages}
        taglineCenter={taglineCenter}
        pageRef={pageRef}
        flags={settings.readinessFlags}
        lang={lang}
      />

      <SupplyMap
        content={content.supply}
        legalFooter={content.common.legalFooter}
        number={4}
        total={totalPages}
        taglineCenter={taglineCenter}
        pageRef={pageRef}
        zones={supplyZones}
      />

      <CertChain
        content={content.cert}
        legalFooter={content.common.legalFooter}
        number={5}
        total={totalPages}
        taglineCenter={taglineCenter}
        pageRef={pageRef}
        settings={settings}
        watermarkText={watermarkText}
      />

      <CsdddBridge
        content={content.csddd}
        legalFooter={content.common.legalFooter}
        number={6}
        total={totalPages}
        taglineCenter={taglineCenter}
        pageRef={pageRef}
        watermarkText={watermarkText}
      />

      <Closing
        content={content.closing}
        legalFooter={content.common.legalFooter}
        number={7}
        total={totalPages}
        taglineCenter={taglineCenter}
        pageRef={pageRef}
        qrSvgString={qrSvgString}
        qrTargetUrl={qrUrl}
        contactName={settings.contact.name}
        contactEmail={settings.contact.email}
        contactPhone={settings.contact.phone}
      />

      {/* On-screen-only auto-print orchestrator. Hidden from the actual
          PDF / Puppeteer snapshot via the `.no-print` rule in styles.css. */}
      <PrintTrigger
        buttonLabel={
          lang === "fr"
            ? "Ouvrir la fenêtre d'impression"
            : "Open the print dialog"
        }
        helperText={
          lang === "fr"
            ? "Sélectionnez « Enregistrer au format PDF » comme destination dans la fenêtre d'impression, puis cliquez sur Enregistrer."
            : 'Choose "Save as PDF" as the destination in the print dialog, then click Save.'
        }
        closeLabel={
          lang === "fr"
            ? "Document prêt. Vous pouvez fermer cet onglet."
            : "Document ready. You can close this tab."
        }
      />
    </main>
  );
}

/* ---------------------------------------------------------- helpers */

function pickFirst(v: string | string[] | undefined): string | undefined {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

function sanitizeBuyer(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  // Strip control chars and dangerous markup chars; keep letters
  // (incl. accented), digits, common punctuation. We deliberately avoid
  // the Unicode property regex (`\p{L}` + `/u`) so this works without
  // bumping the workspace tsconfig target.
  const cleaned = raw
    .replace(/[<>"/\\\n\r\t]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length === 0 ? undefined : cleaned.slice(0, 80);
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    // Strip Unicode combining diacritical marks (block U+0300–U+036F).
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}
