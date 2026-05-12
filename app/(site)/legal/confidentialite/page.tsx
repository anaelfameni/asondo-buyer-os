"use client";

import { LegalShell, PlaceholderValue } from "@/app/components/LegalShell";
import { useI18n } from "@/lib/i18n-context";

export default function PrivacyPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <LegalShell
      eyebrow={fr ? "Données personnelles" : "Personal data"}
      title={fr ? "Politique de confidentialité" : "Privacy policy"}
      subtitle={
        fr
          ? "Comment ASONDO SA collecte, utilise et protège vos données. Conforme RGPD (UE 2016/679) et loi ivoirienne n° 2013-450 sur la protection des données à caractère personnel."
          : "How ASONDO SA collects, uses and protects your data. GDPR-compliant (EU 2016/679) and aligned with Ivorian Law No. 2013-450 on personal-data protection."
      }
      lastUpdated="2026-05-11"
      bgPhoto="/photo1.jpg"
    >
      <h2>{fr ? "1. Responsable de traitement" : "1. Data controller"}</h2>
      <p>
        <strong>ASONDO SA</strong>,{" "}
        {fr
          ? "société de droit ivoirien dont le siège social est situé Treichville, zone 3, Rue des ferronniers, immeuble le blason 3ème étage, Abidjan, Côte d'Ivoire."
          : "an Ivorian-law company with registered office at Treichville, zone 3, Rue des ferronniers, immeuble le blason 3ème étage, Abidjan, Côte d'Ivoire."}
      </p>
      <p>
        <strong>Contact :</strong>{" "}
        <a href="mailto:admin@asondo.ci">admin@asondo.ci</a>
      </p>

      <h2>
        {fr
          ? "2. Délégué à la Protection des Données (DPO)"
          : "2. Data Protection Officer (DPO)"}
      </h2>
      <p>
        {fr
          ? "Pour toute question relative à vos données personnelles ou à l'exercice de vos droits, vous pouvez contacter notre Délégué à la Protection des Données :"
          : "For any question about your personal data or the exercise of your rights, please contact our Data Protection Officer:"}
      </p>
      <ul>
        <li>
          <strong>Email :</strong>{" "}
          <a href="mailto:dpo@asondo.ci">dpo@asondo.ci</a>{" "}
          <PlaceholderValue>
            {fr ? "adresse en cours d'attribution" : "address being assigned"}
          </PlaceholderValue>
        </li>
        <li>
          <strong>{fr ? "Adresse postale" : "Postal address"} :</strong>{" "}
          {fr
            ? "DPO ASONDO SA — Treichville, zone 3, immeuble le blason, Abidjan, Côte d'Ivoire"
            : "DPO ASONDO SA — Treichville, zone 3, immeuble le blason, Abidjan, Côte d'Ivoire"}
        </li>
      </ul>

      <h2>
        {fr
          ? "3. Données collectées et finalités"
          : "3. Data collected and purposes"}
      </h2>
      <table>
        <thead>
          <tr>
            <th>{fr ? "Finalité" : "Purpose"}</th>
            <th>{fr ? "Données" : "Data"}</th>
            <th>{fr ? "Base légale" : "Legal basis"}</th>
            <th>{fr ? "Durée" : "Retention"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {fr
                ? "Traitement RFQ (demande de devis)"
                : "RFQ (request for quote) processing"}
            </td>
            <td>
              {fr
                ? "Nom, email, société, pays, téléphone, volume, port, message, adresse IP"
                : "Name, email, company, country, phone, volume, port, message, IP address"}
            </td>
            <td>
              {fr
                ? "Mesures précontractuelles (art. 6.1.b RGPD)"
                : "Pre-contractual measures (GDPR art. 6.1.b)"}
            </td>
            <td>{fr ? "3 ans après dernier contact" : "3 years after last contact"}</td>
          </tr>
          <tr>
            <td>
              {fr
                ? "Newsletter EUDR & cacao"
                : "EUDR & cocoa newsletter"}
            </td>
            <td>{fr ? "Email" : "Email"}</td>
            <td>
              {fr
                ? "Consentement (art. 6.1.a RGPD)"
                : "Consent (GDPR art. 6.1.a)"}
            </td>
            <td>
              {fr
                ? "Jusqu'à désinscription"
                : "Until unsubscribe"}
            </td>
          </tr>
          <tr>
            <td>{fr ? "Assistant IA conversationnel" : "AI conversational assistant"}</td>
            <td>
              {fr
                ? "Contenu de la conversation, identifiant de session"
                : "Conversation content, session ID"}
            </td>
            <td>
              {fr
                ? "Intérêt légitime (art. 6.1.f RGPD)"
                : "Legitimate interest (GDPR art. 6.1.f)"}
            </td>
            <td>
              {fr
                ? "30 jours (analytique anonymisée au-delà)"
                : "30 days (anonymised analytics beyond)"}
            </td>
          </tr>
          <tr>
            <td>{fr ? "Console CEO authentifiée" : "Authenticated CEO console"}</td>
            <td>
              {fr ? "Cookie de session, journaux d'accès" : "Session cookie, access logs"}
            </td>
            <td>
              {fr
                ? "Intérêt légitime (sécurité)"
                : "Legitimate interest (security)"}
            </td>
            <td>
              {fr
                ? "Session : à la fermeture. Logs : 12 mois"
                : "Session: end of session. Logs: 12 months"}
            </td>
          </tr>
        </tbody>
      </table>

      <h2>{fr ? "4. Destinataires" : "4. Recipients"}</h2>
      <p>
        {fr
          ? "Vos données sont accessibles uniquement aux équipes Asondo en charge du traitement de votre demande, sous engagement de confidentialité, ainsi qu'aux sous-traitants techniques suivants :"
          : "Your data is accessible only to Asondo teams handling your request, under a confidentiality undertaking, as well as to the following technical sub-processors:"}
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> ({fr ? "hébergement web" : "web hosting"}) —{" "}
          {fr ? "USA, sous SCC 2021" : "USA, under 2021 SCC"}
        </li>
        <li>
          <strong>Google LLC</strong> (Gemini API,{" "}
          {fr
            ? "uniquement si l'assistant IA est activé"
            : "only when the AI assistant is enabled"}
          )
        </li>
        <li>
          {fr
            ? "Aucune autre tierce partie ; aucune revente, aucun courtage de données."
            : "No other third party; no resale, no data brokerage."}
        </li>
      </ul>

      <h2>
        {fr
          ? "5. Transferts hors UE / hors Côte d'Ivoire"
          : "5. Transfers outside the EU / Côte d'Ivoire"}
      </h2>
      <p>
        {fr
          ? "L'hébergement Vercel (USA) implique un transfert hors UE encadré par les Standard Contractual Clauses 2021 de la Commission européenne, complétées par des mesures techniques (chiffrement TLS 1.3, données au repos chiffrées AES-256). Le transfert UE → Côte d'Ivoire pour la gestion commerciale est encadré par le consentement explicite de la personne concernée."
          : "Vercel hosting (USA) involves a transfer outside the EU governed by the European Commission's 2021 Standard Contractual Clauses, supplemented by technical measures (TLS 1.3 encryption, AES-256 encryption at rest). The EU → Côte d'Ivoire transfer for commercial management is governed by the explicit consent of the data subject."}
      </p>

      <h2>{fr ? "6. Vos droits" : "6. Your rights"}</h2>
      <p>
        {fr
          ? "Conformément au RGPD et à la loi ivoirienne n° 2013-450, vous disposez des droits suivants :"
          : "In accordance with the GDPR and Ivorian Law No. 2013-450, you have the following rights:"}
      </p>
      <ul>
        <li>{fr ? "Droit d'accès à vos données" : "Right of access to your data"}</li>
        <li>{fr ? "Droit de rectification" : "Right to rectification"}</li>
        <li>
          {fr
            ? "Droit à l'effacement (« droit à l'oubli »)"
            : "Right to erasure (“right to be forgotten”)"}
        </li>
        <li>
          {fr ? "Droit à la portabilité" : "Right to data portability"}
        </li>
        <li>
          {fr ? "Droit à la limitation du traitement" : "Right to restriction of processing"}
        </li>
        <li>
          {fr
            ? "Droit d'opposition au traitement"
            : "Right to object to processing"}
        </li>
        <li>
          {fr
            ? "Droit de retirer votre consentement à tout moment"
            : "Right to withdraw consent at any time"}
        </li>
        <li>
          {fr
            ? "Droit de définir des directives post-mortem sur vos données"
            : "Right to define post-mortem directives on your data"}
        </li>
      </ul>
      <p>
        {fr
          ? "Pour exercer ces droits, écrivez à"
          : "To exercise these rights, write to"}{" "}
        <a href="mailto:dpo@asondo.ci">dpo@asondo.ci</a>{" "}
        {fr
          ? "en joignant un justificatif d'identité. Nous répondons dans un délai maximum d'un mois."
          : "with a proof of identity. We respond within a maximum of one month."}
      </p>

      <h2>{fr ? "7. Cookies" : "7. Cookies"}</h2>
      <p>
        {fr
          ? "Le site asondo.ci utilise uniquement des cookies strictement nécessaires :"
          : "The site asondo.ci uses strictly necessary cookies only:"}
      </p>
      <ul>
        <li>
          <code>asondo-locale</code> —{" "}
          {fr
            ? "préférence linguistique (FR/EN), localStorage côté client, durée 1 an"
            : "language preference (FR/EN), client-side localStorage, duration 1 year"}
        </li>
        <li>
          <code>asondo_console_session</code> —{" "}
          {fr
            ? "uniquement pour les utilisateurs authentifiés à la console CEO, durée de session"
            : "only for authenticated CEO console users, session duration"}
        </li>
      </ul>
      <p>
        {fr
          ? "Aucun cookie publicitaire, marketing ou analytique tiers n'est déposé. Aucune bannière de consentement n'est requise pour ces cookies essentiels."
          : "No advertising, marketing or third-party analytics cookies are deposited. No consent banner is required for these essential cookies."}
      </p>

      <h2>{fr ? "8. Sécurité" : "8. Security"}</h2>
      <p>
        {fr
          ? "ASONDO SA met en œuvre des mesures techniques et organisationnelles adaptées : chiffrement TLS 1.3 en transit, chiffrement AES-256 au repos, accès restreint sur authentification forte, journalisation des accès, sauvegardes chiffrées, plan de réponse aux incidents."
          : "ASONDO SA implements appropriate technical and organisational measures: TLS 1.3 encryption in transit, AES-256 encryption at rest, restricted access with strong authentication, access logging, encrypted backups, incident-response plan."}
      </p>

      <h2>{fr ? "9. Réclamation" : "9. Complaint"}</h2>
      <p>
        {fr
          ? "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de :"
          : "If you consider that your rights are not respected, you may lodge a complaint with:"}
      </p>
      <ul>
        <li>
          <strong>
            {fr
              ? "Autorité de Protection des Données Personnelles (APDP) — Côte d'Ivoire"
              : "Personal Data Protection Authority (APDP) — Côte d'Ivoire"}
          </strong>{" "}
          —{" "}
          <a
            href="https://apdp.ci"
            target="_blank"
            rel="noopener noreferrer"
          >
            apdp.ci
          </a>
        </li>
        <li>
          <strong>
            {fr
              ? "Autorité de contrôle de l'Union européenne compétente"
              : "Competent European Union supervisory authority"}
          </strong>{" "}
          (
          {fr
            ? "ex. CNIL en France"
            : "e.g. CNIL in France"}{" "}
          —{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr
          </a>
          )
        </li>
      </ul>

      <h2>
        {fr ? "10. Évolution de la politique" : "10. Policy updates"}
      </h2>
      <p>
        {fr
          ? "ASONDO SA peut faire évoluer la présente politique pour refléter les changements réglementaires ou opérationnels. La date de dernière mise à jour est indiquée en haut de cette page."
          : "ASONDO SA may update this policy to reflect regulatory or operational changes. The last-updated date is shown at the top of this page."}
      </p>
    </LegalShell>
  );
}
