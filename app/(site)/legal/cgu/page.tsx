"use client";

import { LegalShell } from "@/app/components/LegalShell";
import { useI18n } from "@/lib/i18n-context";

export default function CguPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <LegalShell
      eyebrow={fr ? "Conditions" : "Terms"}
      title={
        fr ? "Conditions générales d'utilisation" : "Terms of use"
      }
      subtitle={
        fr
          ? "Règles applicables à toute consultation et utilisation du site asondo.ci."
          : "Rules applicable to any consultation and use of asondo.ci."
      }
      lastUpdated="2026-05-11"
    >
      <h2>{fr ? "1. Objet" : "1. Purpose"}</h2>
      <p>
        {fr
          ? "Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'accès et d'utilisation du site asondo.ci, édité par ASONDO SA. Elles s'appliquent à tout utilisateur consultant le site, qu'il soit acheteur professionnel, partenaire institutionnel, journaliste, chercheur ou simple visiteur."
          : "These Terms of Use (ToU) set out the conditions for accessing and using asondo.ci, published by ASONDO SA. They apply to any user consulting the site, whether a professional buyer, institutional partner, journalist, researcher or casual visitor."}
      </p>

      <h2>{fr ? "2. Acceptation" : "2. Acceptance"}</h2>
      <p>
        {fr
          ? "La consultation du site asondo.ci vaut acceptation pleine et entière des présentes CGU. L'utilisateur reconnaît en avoir pris connaissance et accepte de s'y conformer. Si l'utilisateur n'accepte pas les CGU, il doit immédiatement cesser d'utiliser le site."
          : "Browsing asondo.ci constitutes full acceptance of these ToU. The user acknowledges having read them and agrees to comply with them. If the user does not accept the ToU, they must immediately stop using the site."}
      </p>

      <h2>{fr ? "3. Accès au site" : "3. Site access"}</h2>
      <p>
        {fr
          ? "L'accès au site asondo.ci est libre et gratuit. Il est accessible 24 heures sur 24, 7 jours sur 7, sauf cas de force majeure, opérations de maintenance, ou panne du fournisseur d'hébergement. Asondo se réserve le droit, sans préavis ni indemnité, de suspendre, limiter ou interrompre l'accès au site."
          : "Access to asondo.ci is free and unrestricted. It is available 24/7, except in cases of force majeure, maintenance operations, or hosting-provider downtime. Asondo reserves the right, without notice or compensation, to suspend, limit or interrupt access to the site."}
      </p>
      <p>
        {fr
          ? "Certaines sections (console CEO, espace acheteur authentifié) sont réservées à des utilisateurs autorisés et nécessitent une authentification. L'utilisateur est responsable de la confidentialité de ses identifiants."
          : "Certain sections (CEO console, authenticated buyer area) are reserved for authorised users and require authentication. The user is responsible for keeping their credentials confidential."}
      </p>

      <h2>
        {fr ? "4. Utilisation autorisée" : "4. Permitted use"}
      </h2>
      <p>
        {fr
          ? "L'utilisateur s'engage à utiliser le site asondo.ci de bonne foi, conformément à sa destination commerciale et informationnelle. Sont notamment interdits :"
          : "The user undertakes to use asondo.ci in good faith, in accordance with its commercial and informational purpose. The following are notably prohibited:"}
      </p>
      <ul>
        <li>
          {fr
            ? "Toute utilisation à des fins illicites, frauduleuses ou portant atteinte aux droits d'autrui"
            : "Any use for unlawful, fraudulent purposes or infringing the rights of others"}
        </li>
        <li>
          {fr
            ? "Toute tentative d'accès non autorisé aux systèmes ou données"
            : "Any attempt to gain unauthorised access to systems or data"}
        </li>
        <li>
          {fr
            ? "Toute extraction massive automatisée du contenu (scraping, moissonnage)"
            : "Any massive automated content extraction (scraping, harvesting)"}
        </li>
        <li>
          {fr
            ? "Toute reproduction, redistribution ou exploitation commerciale sans autorisation"
            : "Any reproduction, redistribution or commercial exploitation without authorisation"}
        </li>
        <li>
          {fr
            ? "L'envoi de contenu malveillant, virus ou code destiné à perturber le fonctionnement du site"
            : "Sending malicious content, viruses or code intended to disrupt the site"}
        </li>
        <li>
          {fr
            ? "L'usurpation d'identité d'un acheteur ou partenaire dans les formulaires"
            : "Impersonating a buyer or partner in the forms"}
        </li>
      </ul>

      <h2>
        {fr ? "5. Propriété intellectuelle" : "5. Intellectual property"}
      </h2>
      <p>
        {fr
          ? "L'ensemble des éléments du site (marque Asondo, logos, textes, photographies, visuels, structure, code source, base de données) sont protégés par le droit de la propriété intellectuelle. Toute utilisation non expressément autorisée est strictement interdite et susceptible de poursuites."
          : "All elements of the site (Asondo trademark, logos, texts, photographs, visuals, structure, source code, database) are protected by intellectual-property law. Any use not expressly authorised is strictly prohibited and liable to prosecution."}
      </p>
      <p>
        {fr
          ? "Les marques tierces affichées (Conseil du Café-Cacao, Federation of Cocoa Commerce, Rainforest Alliance, Union européenne) restent la propriété de leurs titulaires."
          : "Third-party trademarks shown (Conseil du Café-Cacao, Federation of Cocoa Commerce, Rainforest Alliance, European Union) remain the property of their owners."}
      </p>

      <h2>
        {fr ? "6. Données personnelles" : "6. Personal data"}
      </h2>
      <p>
        {fr
          ? "Le traitement des données personnelles est encadré par notre"
          : "Processing of personal data is governed by our"}{" "}
        <a href="/legal/confidentialite">
          {fr ? "Politique de confidentialité" : "Privacy policy"}
        </a>
        .
      </p>

      <h2>{fr ? "7. Responsabilité" : "7. Liability"}</h2>
      <p>
        {fr
          ? "Le site asondo.ci est fourni « en l'état ». Les informations diffusées (chiffres, statistiques, indicateurs EUDR, cartes, listes de coopératives) sont fournies à titre informatif et n'engagent pas contractuellement ASONDO SA. Les engagements commerciaux sont formalisés exclusivement par le Buyer Pack signé et la confirmation d'une demande de devis (RFQ)."
          : "asondo.ci is provided “as is”. The information disseminated (figures, statistics, EUDR indicators, maps, cooperative lists) is provided for information only and does not contractually bind ASONDO SA. Commercial commitments are formalised exclusively through the signed Buyer Pack and the confirmation of a Request for Quote (RFQ)."}
      </p>
      <p>
        {fr
          ? "ASONDO SA ne saurait être tenue responsable des dommages indirects (perte de données, perte d'opportunités commerciales, atteinte à la réputation) liés à l'utilisation du site, sauf cas de faute lourde ou intentionnelle."
          : "ASONDO SA cannot be held liable for indirect damages (data loss, loss of commercial opportunities, reputation damage) related to use of the site, except in cases of gross or wilful misconduct."}
      </p>

      <h2>{fr ? "8. Liens externes" : "8. External links"}</h2>
      <p>
        {fr
          ? "Le site peut renvoyer vers des sites tiers (sources publiques, articles de presse, sites de partenaires). ASONDO SA ne contrôle pas ces sites et n'engage pas sa responsabilité quant à leur contenu, leurs pratiques de confidentialité ou leur disponibilité."
          : "The site may link to third-party sites (public sources, press articles, partner sites). ASONDO SA does not control these sites and bears no responsibility for their content, privacy practices or availability."}
      </p>

      <h2>{fr ? "9. Modification des CGU" : "9. ToU updates"}</h2>
      <p>
        {fr
          ? "ASONDO SA se réserve le droit de modifier à tout moment les présentes CGU, notamment pour s'adapter aux évolutions réglementaires ou opérationnelles. La version applicable est celle accessible en ligne au moment de la consultation. La date de dernière mise à jour figure en haut de cette page."
          : "ASONDO SA reserves the right to update these ToU at any time, in particular to adapt to regulatory or operational developments. The applicable version is the one accessible online at the time of consultation. The last-updated date is shown at the top of this page."}
      </p>

      <h2>
        {fr ? "10. Loi applicable et juridiction" : "10. Governing law and jurisdiction"}
      </h2>
      <p>
        {fr
          ? "Les présentes CGU sont régies par le droit ivoirien et, le cas échéant, par le droit OHADA. Tout litige relatif à l'utilisation du site asondo.ci sera soumis à la compétence exclusive du Tribunal de commerce d'Abidjan, après tentative préalable de règlement amiable."
          : "These ToU are governed by Ivorian law and, where applicable, by OHADA law. Any dispute relating to the use of asondo.ci shall be subject to the exclusive jurisdiction of the Commercial Court of Abidjan, after a prior attempt at amicable settlement."}
      </p>

      <h2>{fr ? "11. Contact" : "11. Contact"}</h2>
      <p>
        {fr
          ? "Pour toute question relative aux présentes CGU :"
          : "For any question regarding these ToU:"}{" "}
        <a href="mailto:admin@asondo.ci">admin@asondo.ci</a>
      </p>
    </LegalShell>
  );
}
