"use client";

import { LegalShell, PlaceholderValue } from "@/app/components/LegalShell";
import { useI18n } from "@/lib/i18n-context";
import { asondoData } from "@/lib/asondo-data";

export default function MentionsLegalesPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <LegalShell
      eyebrow={fr ? "Identité de l'éditeur" : "Publisher identity"}
      title={fr ? "Mentions légales" : "Legal notice"}
      subtitle={
        fr
          ? "Identité de l'éditeur du site asondo.ci, conformément aux obligations applicables en Côte d'Ivoire et dans l'Union européenne."
          : "Identification of the publisher of asondo.ci, in compliance with applicable Ivorian and European Union obligations."
      }
      lastUpdated="2026-05-11"
    >
      <h2>{fr ? "1. Éditeur du site" : "1. Site publisher"}</h2>
      <p>
        <strong>{asondoData.identity.legalName}</strong> —{" "}
        {fr
          ? "Société de droit ivoirien spécialisée dans l'export de fèves de cacao."
          : "Ivorian-law company specialised in cocoa-bean exports."}
      </p>
      <ul>
        <li>
          <strong>{fr ? "Forme juridique" : "Legal form"} :</strong>{" "}
          {fr ? asondoData.legal.legalForm : asondoData.legal.legalFormEn}
        </li>
        <li>
          <strong>{fr ? "Capital social" : "Share capital"} :</strong>{" "}
          {asondoData.legal.shareCapitalXOF.toLocaleString(
            fr ? "fr-FR" : "en-US"
          )}{" "}
          FCFA (XOF){" "}
          <span className="text-xs text-[#6B7280]">
            (
            {fr
              ? `porté à ce montant par AGE du ${asondoData.legal.shareCapitalRaisedAt}`
              : `raised to this amount by EGM dated ${asondoData.legal.shareCapitalRaisedAt}`}
            )
          </span>
        </li>
        <li>
          <strong>RCCM :</strong> {asondoData.legal.rccm}
        </li>
        <li>
          <strong>
            {fr ? "Numéro Greffe" : "Court filing number"} :
          </strong>{" "}
          {asondoData.legal.courtFiling}{" "}
          <span className="text-xs text-[#6B7280]">
            (
            {fr ? "déposé le" : "filed on"}{" "}
            {asondoData.legal.courtFilingDate} —{" "}
            {asondoData.legal.court})
          </span>
        </li>
        <li>
          <strong>
            {fr ? "Compte contribuable / NIF" : "Tax ID / NIF"} :
          </strong>{" "}
          {asondoData.legal.nif ?? (
            <PlaceholderValue>
              {fr
                ? "à compléter — non publié sur sources publiques"
                : "to be filled — not published on public sources"}
            </PlaceholderValue>
          )}
        </li>
        <li>
          <strong>
            {fr ? "Code Importateur/Exportateur" : "Importer/Exporter code"}
          </strong>{" "}
          ({fr ? "Min. du Commerce CI" : "CI Ministry of Commerce"}) :{" "}
          {asondoData.legal.importExportCode ?? (
            <PlaceholderValue>
              {fr
                ? "à compléter — non publié sur sources publiques"
                : "to be filled — not published on public sources"}
            </PlaceholderValue>
          )}
        </li>
        <li>
          <strong>
            {fr ? "Licence d'exportation" : "Export licence"} :
          </strong>{" "}
          {asondoData.identity.licence} —{" "}
          <a
            href="https://www.reuters.com/article/markets/commodities/ivory-coast-issues-109-cocoa-export-licences-for-2025-26-season-idUSL8N30K2XE/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {fr ? "source publique" : "public source"}
          </a>
        </li>
      </ul>
      <p className="text-xs text-[#6B7280] italic mt-2">
        {fr ? "Source publique des données légales : " : "Public source for legal data: "}
        <a
          href={asondoData.legal.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {asondoData.legal.notary}
        </a>{" "}
        — {fr ? "annonce d'augmentation de capital, Abidjan.net" : "capital-raise legal notice, Abidjan.net"}.
      </p>

      <h2>{fr ? "2. Siège social et contact" : "2. Registered office and contact"}</h2>
      <ul>
        <li>
          <strong>{fr ? "Adresse" : "Address"} :</strong>{" "}
          {asondoData.identity.address}, {asondoData.identity.city},{" "}
          {asondoData.identity.country}
        </li>
        <li>
          <strong>{fr ? "Téléphone" : "Phone"} :</strong>{" "}
          <a href={`tel:${asondoData.identity.phone}`}>
            {asondoData.identity.phone}
          </a>
        </li>
        <li>
          <strong>Email :</strong>{" "}
          <a href={`mailto:${asondoData.identity.email}`}>
            {asondoData.identity.email}
          </a>
        </li>
        <li>
          <strong>{fr ? "Site web" : "Website"} :</strong>{" "}
          <a
            href={asondoData.identity.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {asondoData.identity.website}
          </a>
        </li>
      </ul>

      <h2>{fr ? "3. Directeur de la publication" : "3. Publication director"}</h2>
      <p>
        {fr
          ? "Le directeur de la publication est le représentant légal de la société :"
          : "The publication director is the legal representative of the company:"}
      </p>
      <ul>
        <li>
          <strong>{fr ? "Nom" : "Name"} :</strong>{" "}
          {asondoData.leadership.ceoName}
        </li>
        <li>
          <strong>{fr ? "Fonction" : "Role"} :</strong>{" "}
          {fr
            ? asondoData.leadership.ceoRole
            : asondoData.leadership.ceoRoleEn}
          ,{" "}
          {asondoData.identity.legalName}
        </li>
        <li>
          <strong>{fr ? "Contact direction" : "Management contact"} :</strong>{" "}
          <a href="mailto:admin@asondo.ci">admin@asondo.ci</a>
        </li>
      </ul>

      <h2>{fr ? "4. Hébergeur" : "4. Hosting provider"}</h2>
      <p>
        {fr
          ? "Le site asondo.ci est hébergé par :"
          : "The site asondo.ci is hosted by:"}
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong>
        </li>
        <li>
          440 N Barranca Ave #4133, Covina, CA 91723 — USA
        </li>
        <li>
          {fr ? "Site web" : "Website"} :{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
        </li>
      </ul>
      <p>
        {fr
          ? "Vercel est conforme aux Standard Contractual Clauses 2021 de la Commission européenne pour les transferts de données hors UE."
          : "Vercel complies with the European Commission's 2021 Standard Contractual Clauses for data transfers outside the EU."}
      </p>

      <h2>
        {fr ? "5. Propriété intellectuelle" : "5. Intellectual property"}
      </h2>
      <p>
        {fr
          ? "L'ensemble des contenus du site asondo.ci (textes, images, logos, photographies, vidéos, structure, code source) est la propriété exclusive de ASONDO SA ou de ses partenaires, et est protégé par le droit de la propriété intellectuelle ivoirien (loi n° 2016-555 du 26 juillet 2016) et international."
          : "All content on asondo.ci (texts, images, logos, photographs, videos, structure, source code) is the exclusive property of ASONDO SA or its partners, and is protected by Ivorian intellectual-property law (Law No. 2016-555 of 26 July 2016) and international law."}
      </p>
      <p>
        {fr
          ? "Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, par quelque procédé que ce soit, est interdite sans autorisation écrite préalable de ASONDO SA."
          : "Any reproduction, representation, modification, publication or adaptation, in whole or in part, by any means, is prohibited without the prior written consent of ASONDO SA."}
      </p>
      <p>
        {fr
          ? "Les marques et logos des partenaires affichés sur le site (Conseil du Café-Cacao, Federation of Cocoa Commerce, Rainforest Alliance, Union européenne EUDR) restent la propriété de leurs titulaires respectifs et sont reproduits à titre informatif."
          : "Partner trademarks and logos shown on the site (Conseil du Café-Cacao, Federation of Cocoa Commerce, Rainforest Alliance, European Union EUDR) remain the property of their respective owners and are reproduced for information only."}
      </p>

      <h2>
        {fr
          ? "6. Responsabilité éditoriale"
          : "6. Editorial responsibility"}
      </h2>
      <p>
        {fr
          ? "ASONDO SA s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur asondo.ci. Toutefois, les chiffres, volumes, statistiques et indicateurs publiés sur le site sont fournis à titre informatif et ne constituent pas un engagement contractuel. Les engagements commerciaux sont formalisés exclusivement par le Buyer Pack signé et la confirmation contractuelle d'une demande de devis (RFQ)."
          : "ASONDO SA makes every effort to ensure the accuracy and currency of the information published on asondo.ci. However, the figures, volumes, statistics and indicators published on the site are provided for information only and do not constitute a contractual commitment. Commercial commitments are formalised exclusively through the signed Buyer Pack and the contractual confirmation of a Request for Quote (RFQ)."}
      </p>

      <h2>{fr ? "7. Liens externes" : "7. External links"}</h2>
      <p>
        {fr
          ? "Le site asondo.ci peut contenir des liens vers des sites tiers. ASONDO SA n'exerce aucun contrôle sur ces sites et n'engage pas sa responsabilité quant à leur contenu, leurs pratiques de confidentialité ou leur disponibilité."
          : "asondo.ci may contain links to third-party sites. ASONDO SA exercises no control over those sites and bears no responsibility for their content, privacy practices, or availability."}
      </p>

      <h2>
        {fr
          ? "8. Données personnelles"
          : "8. Personal data"}
      </h2>
      <p>
        {fr
          ? "Le traitement des données personnelles collectées sur asondo.ci (formulaires RFQ, newsletter, console CEO) est encadré par notre"
          : "The processing of personal data collected on asondo.ci (RFQ forms, newsletter, CEO console) is governed by our"}{" "}
        <a href="/legal/confidentialite">
          {fr ? "Politique de confidentialité" : "Privacy policy"}
        </a>
        .
      </p>

      <h2>
        {fr ? "9. Loi applicable et juridiction" : "9. Governing law and jurisdiction"}
      </h2>
      <p>
        {fr
          ? "Les présentes mentions légales et l'utilisation du site sont régies par le droit ivoirien et, le cas échéant, par le droit OHADA. Tout litige relatif à l'utilisation du site asondo.ci sera soumis à la compétence exclusive du Tribunal de commerce d'Abidjan."
          : "These legal notices and the use of the site are governed by Ivorian law and, where applicable, by OHADA law. Any dispute relating to the use of asondo.ci shall be subject to the exclusive jurisdiction of the Commercial Court of Abidjan."}
      </p>

      <hr />

      <p>
        <em>
          {fr
            ? "Les valeurs marquées « à compléter » sont en attente de publication officielle. Pour toute demande administrative ou réglementaire, contactez admin@asondo.ci."
            : "Values marked “to be filled” are awaiting official publication. For any administrative or regulatory request, please contact admin@asondo.ci."}
        </em>
      </p>
    </LegalShell>
  );
}
