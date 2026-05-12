"use client";

import { LegalShell, PlaceholderValue } from "@/app/components/LegalShell";
import { useI18n } from "@/lib/i18n-context";
import { asondoData } from "@/lib/asondo-data";

export default function ComplianceOfficerPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <LegalShell
      eyebrow="EUDR · Article 4"
      title={
        fr
          ? "Responsable conformité EUDR"
          : "EUDR Compliance Officer"
      }
      subtitle={
        fr
          ? "Identification et mission du responsable du système de diligence raisonnée Asondo, conformément à l'article 4 du Règlement (UE) 2023/1115."
          : "Identification and mission of the Asondo due-diligence system officer, in accordance with Article 4 of Regulation (EU) 2023/1115."
      }
      lastUpdated="2026-05-11"
      bgPhoto="/photo3.jpg"
    >
      <h2>{fr ? "1. Cadre réglementaire" : "1. Regulatory framework"}</h2>
      <p>
        {fr
          ? "Le Règlement (UE) 2023/1115 relatif à la mise à disposition sur le marché de l'Union et à l'exportation à partir de l'Union de certaines matières premières et de certains produits associés à la déforestation et à la dégradation des forêts (« EUDR ») impose aux opérateurs et aux commerçants de mettre en place un système de diligence raisonnée et d'en désigner un responsable."
          : "Regulation (EU) 2023/1115 on the making available on the Union market and the export from the Union of certain commodities and products associated with deforestation and forest degradation (“EUDR”) requires operators and traders to set up a due-diligence system and to designate an officer responsible for it."}
      </p>
      <p>
        {fr
          ? "ASONDO SA, en tant qu'exportateur de fèves de cacao (code SH 1801) vers le marché de l'Union européenne, est soumise à cette obligation et a désigné un Responsable Conformité EUDR (Compliance Officer)."
          : "ASONDO SA, as an exporter of cocoa beans (HS code 1801) to the European Union market, is subject to this obligation and has appointed an EUDR Compliance Officer."}
      </p>
      <p>
        <strong>{fr ? "Représentant légal de l'opérateur" : "Operator's legal representative"} :</strong>{" "}
        {asondoData.leadership.ceoName} —{" "}
        {fr
          ? asondoData.leadership.ceoRole
          : asondoData.leadership.ceoRoleEn}
        , {asondoData.identity.legalName}{" "}
        ({fr ? "RCCM" : "Trade register"} {asondoData.legal.rccm}).
      </p>

      <h2>{fr ? "2. Identité et contact" : "2. Identity and contact"}</h2>
      <ul>
        <li>
          <strong>{fr ? "Nom" : "Name"} :</strong>{" "}
          <PlaceholderValue>
            {fr
              ? "Nomination en cours — communiquée nominativement aux acheteurs sous Buyer Pack"
              : "Appointment in progress — disclosed by name to buyers under Buyer Pack"}
          </PlaceholderValue>
        </li>
        <li>
          <strong>{fr ? "Fonction" : "Role"} :</strong>{" "}
          {fr
            ? "Responsable Conformité EUDR / Operator Due-Diligence Officer"
            : "EUDR Compliance Officer / Operator Due-Diligence Officer"}
        </li>
        <li>
          <strong>Email :</strong>{" "}
          <a href="mailto:compliance@asondo.ci">
            compliance@asondo.ci
          </a>
        </li>
        <li>
          <strong>{fr ? "Téléphone" : "Phone"} :</strong> +225 07 99 85 29 16
        </li>
        <li>
          <strong>{fr ? "Adresse" : "Address"} :</strong>{" "}
          {fr
            ? "Compliance EUDR — ASONDO SA, Treichville zone 3, immeuble le blason, Abidjan, Côte d'Ivoire"
            : "EUDR Compliance — ASONDO SA, Treichville zone 3, immeuble le blason, Abidjan, Côte d'Ivoire"}
        </li>
      </ul>

      <h2>{fr ? "3. Missions et responsabilités" : "3. Missions and responsibilities"}</h2>
      <p>
        {fr
          ? "Le Responsable Conformité EUDR pilote l'ensemble du système de diligence raisonnée Asondo. Ses missions principales sont :"
          : "The EUDR Compliance Officer steers the entire Asondo due-diligence system. Their main missions are:"}
      </p>
      <ol>
        <li>
          <strong>{fr ? "Collecte d'information" : "Information collection"} —</strong>{" "}
          {fr
            ? "rassemblement et tenue à jour des polygones GPS des parcelles, des dates de production, des informations sur les coopératives partenaires et des planteurs identifiés."
            : "gathering and keeping up to date the GPS polygons of plots, production dates, information on partner cooperatives, and identified farmers."}
        </li>
        <li>
          <strong>
            {fr
              ? "Évaluation des risques de déforestation"
              : "Deforestation risk assessment"}{" "}
            —
          </strong>{" "}
          {fr
            ? "analyse de chaque parcelle au regard de la date butoir EUDR du 31 décembre 2020, en croisant les polygones avec les sources de référence (Hansen Global Forest Change, JRC TMF, ECA Whisp ou équivalent)."
            : "analysis of each plot against the EUDR cut-off date of 31 December 2020, by cross-checking polygons with reference sources (Hansen Global Forest Change, JRC TMF, ECA Whisp or equivalent)."}
        </li>
        <li>
          <strong>
            {fr ? "Atténuation des risques" : "Risk mitigation"} —
          </strong>{" "}
          {fr
            ? "mise en œuvre de mesures correctrices (audit terrain, exclusion temporaire d'une parcelle, accompagnement coopérative) lorsque le risque n'est pas négligeable."
            : "implementation of corrective measures (field audit, temporary exclusion of a plot, cooperative support) when the risk is not negligible."}
        </li>
        <li>
          <strong>
            {fr ? "Déclaration de diligence raisonnée (DDS)" : "Due Diligence Statement (DDS)"}{" "}
            —
          </strong>{" "}
          {fr
            ? "génération, signature électronique et soumission au système d'information EUDR de la Commission européenne pour chaque expédition. Communication du numéro de référence à l'acheteur de l'Union."
            : "generation, electronic signing, and submission to the European Commission's EUDR information system for each shipment. Communication of the reference number to the EU buyer."}
        </li>
        <li>
          <strong>
            {fr ? "Tenue de registres" : "Recordkeeping"} —
          </strong>{" "}
          {fr
            ? "conservation pendant 5 ans des informations, pièces justificatives et résultats d'évaluation, accessibles aux autorités compétentes sur demande."
            : "retention for 5 years of information, supporting documents and assessment results, available to competent authorities on request."}
        </li>
        <li>
          <strong>
            {fr ? "Revue annuelle" : "Annual review"} —
          </strong>{" "}
          {fr
            ? "réexamen formel du système de diligence raisonnée au moins une fois par an, avec amélioration continue et documentation des changements."
            : "formal re-examination of the due-diligence system at least once a year, with continuous improvement and documented changes."}
        </li>
        <li>
          <strong>
            {fr ? "Interface autorités" : "Authority interface"} —
          </strong>{" "}
          {fr
            ? "point de contact unique avec les autorités compétentes ivoiriennes (CCC, ministère du Commerce) et européennes (autorité compétente de l'État membre d'importation)."
            : "single point of contact with the competent Ivorian authorities (CCC, Ministry of Commerce) and European authorities (competent authority of the Member State of import)."}
        </li>
      </ol>

      <h2>
        {fr
          ? "4. Procédure de remontée d'alerte (whistleblowing)"
          : "4. Whistleblowing procedure"}
      </h2>
      <p>
        {fr
          ? "Tout acheteur, partenaire, planteur ou tiers ayant connaissance d'un risque de non-conformité EUDR (déforestation, illégalité, falsification de polygone, fausse déclaration) peut signaler le fait au Responsable Conformité par les canaux suivants :"
          : "Any buyer, partner, farmer or third party aware of an EUDR non-compliance risk (deforestation, illegality, polygon falsification, false declaration) may report it to the Compliance Officer through the following channels:"}
      </p>
      <ul>
        <li>
          {fr ? "Email confidentiel" : "Confidential email"} :{" "}
          <a href="mailto:compliance@asondo.ci">compliance@asondo.ci</a>
        </li>
        <li>
          {fr ? "Email anonyme (bip)" : "Anonymous email (bip)"} :{" "}
          <PlaceholderValue>
            {fr ? "bip@asondo.ci en cours d'activation" : "bip@asondo.ci being activated"}
          </PlaceholderValue>
        </li>
        <li>
          {fr ? "Courrier postal scellé" : "Sealed postal mail"} :{" "}
          {fr
            ? "« Compliance Officer — Confidentiel »"
            : "“Compliance Officer — Confidential”"}{" "}
          — ASONDO SA, Treichville zone 3, Abidjan, Côte d’Ivoire
        </li>
      </ul>
      <p>
        {fr
          ? "Asondo s'engage à protéger l'identité du lanceur d'alerte et à n'exercer aucune mesure de représailles à son encontre, conformément aux meilleures pratiques internationales (Directive UE 2019/1937)."
          : "Asondo undertakes to protect the whistleblower's identity and to take no retaliatory measure, in accordance with international best practices (EU Directive 2019/1937)."}
      </p>

      <h2>
        {fr
          ? "5. Référence DDS et traçabilité aval"
          : "5. DDS reference and downstream traceability"}
      </h2>
      <p>
        {fr
          ? "Pour chaque expédition à destination de l'Union européenne, le Responsable Conformité EUDR communique à l'acheteur le numéro de référence et de vérification de la Déclaration de Diligence Raisonnée (DDS Reference Number et DDS Verification Number) avant la mise sur le marché."
          : "For each shipment to the European Union, the EUDR Compliance Officer provides the buyer with the Due Diligence Statement reference and verification numbers (DDS Reference Number and DDS Verification Number) before placing on the market."}
      </p>
      <p>
        {fr ? "Voir le modèle :" : "See the template:"}{" "}
        <a href="/eudr/due-diligence-statement">
          {fr
            ? "Modèle de Déclaration de Diligence Raisonnée (DDS) Asondo"
            : "Asondo Due Diligence Statement template"}
        </a>
        .
      </p>

      <h2>
        {fr ? "6. Audit indépendant" : "6. Independent audit"}
      </h2>
      <p>
        {fr
          ? "Le système de diligence raisonnée Asondo est auditable par un organisme tiers indépendant (à la demande de l'acheteur ou de l'autorité compétente). Les audits sont coordonnés par le Responsable Conformité EUDR. Les rapports d'audit sont communiqués sous NDA aux acheteurs vérifiés."
          : "The Asondo due-diligence system is auditable by an independent third-party body (at the request of the buyer or the competent authority). Audits are coordinated by the EUDR Compliance Officer. Audit reports are shared under NDA with verified buyers."}
      </p>
    </LegalShell>
  );
}
