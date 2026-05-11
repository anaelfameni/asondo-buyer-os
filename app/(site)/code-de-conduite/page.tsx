"use client";

import { LegalShell } from "@/app/components/LegalShell";
import { useI18n } from "@/lib/i18n-context";

export default function CodeOfConductPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <LegalShell
      eyebrow={fr ? "Engagement" : "Commitment"}
      title={
        fr
          ? "Code de Conduite Fournisseurs"
          : "Supplier Code of Conduct"
      }
      subtitle={
        fr
          ? "Engagements éthiques, environnementaux et sociaux que partagent ASONDO SA et l'ensemble de ses coopératives partenaires. La signature de ce code conditionne l'entrée dans le réseau Asondo."
          : "Ethical, environmental and social commitments shared by ASONDO SA and all its partner cooperatives. Signing this code is a prerequisite for joining the Asondo network."
      }
      lastUpdated="2026-05-11"
    >
      <h2>{fr ? "1. Préambule" : "1. Preamble"}</h2>
      <p>
        {fr
          ? "Le cacao est un héritage. La filière ivoirienne emploie plusieurs millions de personnes. ASONDO SA s'engage à ce que chaque kilogramme exporté soit produit dans des conditions dignes, légales, durables et traçables. Le présent code lie ASONDO SA et chaque coopérative partenaire ; il s'applique également à toute coopérative en discussion d'intégration au réseau Asondo."
          : "Cocoa is a heritage. The Ivorian value chain employs several million people. ASONDO SA undertakes that every kilogram exported is produced under dignified, lawful, sustainable and traceable conditions. This code binds ASONDO SA and every partner cooperative; it also applies to any cooperative discussing entry into the Asondo network."}
      </p>

      <h2>
        {fr ? "2. Conformité légale" : "2. Legal compliance"}
      </h2>
      <p>
        {fr
          ? "Le fournisseur respecte intégralement le droit ivoirien et international applicables, notamment :"
          : "The supplier fully complies with applicable Ivorian and international law, including:"}
      </p>
      <ul>
        <li>{fr ? "Le Code du travail ivoirien" : "Ivorian Labour Code"}</li>
        <li>
          {fr
            ? "Le cadre du Conseil du Café-Cacao (CCC) et le Système National de Traçabilité"
            : "The Conseil du Café-Cacao (CCC) framework and National Traceability System"}
        </li>
        <li>
          {fr
            ? "Le Règlement (UE) 2023/1115 (« EUDR ») relatif à la déforestation"
            : "Regulation (EU) 2023/1115 (“EUDR”) on deforestation"}
        </li>
        <li>
          {fr
            ? "Les conventions fondamentales de l'OIT (n° 29, 105, 138, 182, 87, 98, 100, 111)"
            : "ILO fundamental conventions (Nos. 29, 105, 138, 182, 87, 98, 100, 111)"}
        </li>
        <li>
          {fr
            ? "La Déclaration universelle des droits de l'homme"
            : "Universal Declaration of Human Rights"}
        </li>
      </ul>

      <h2>{fr ? "3. Droits humains" : "3. Human rights"}</h2>
      <ul>
        <li>
          <strong>
            {fr ? "Travail des enfants" : "Child labour"} —
          </strong>{" "}
          {fr
            ? "interdiction absolue. Aucun enfant de moins de 15 ans ne participe à des travaux dangereux ou réguliers. Les enfants des planteurs vont à l'école."
            : "absolutely prohibited. No child under 15 takes part in hazardous or regular work. Farmers' children go to school."}
        </li>
        <li>
          <strong>
            {fr ? "Travail forcé" : "Forced labour"} —
          </strong>{" "}
          {fr
            ? "interdiction absolue. Toute personne travaillant pour une coopérative partenaire le fait volontairement, conserve ses papiers et peut quitter son emploi à tout moment."
            : "absolutely prohibited. Every person working for a partner cooperative does so voluntarily, retains their documents and may leave employment at any time."}
        </li>
        <li>
          <strong>{fr ? "Non-discrimination" : "Non-discrimination"} —</strong>{" "}
          {fr
            ? "aucune discrimination fondée sur le genre, l'origine, la religion, l'opinion politique, l'orientation, le handicap ou le statut social."
            : "no discrimination based on gender, origin, religion, political opinion, orientation, disability or social status."}
        </li>
        <li>
          <strong>
            {fr ? "Liberté d'association" : "Freedom of association"} —
          </strong>{" "}
          {fr
            ? "respect du droit à se syndiquer et à négocier collectivement."
            : "respect for the right to unionise and bargain collectively."}
        </li>
        <li>
          <strong>
            {fr ? "Harcèlement et abus" : "Harassment and abuse"} —
          </strong>{" "}
          {fr
            ? "tolérance zéro. Tout incident est signalé au Compliance Officer Asondo."
            : "zero tolerance. Any incident is reported to the Asondo Compliance Officer."}
        </li>
      </ul>

      <h2>{fr ? "4. Conditions de travail" : "4. Working conditions"}</h2>
      <ul>
        <li>
          {fr
            ? "Rémunération conforme au minimum légal et au prix officiel CCC, payée à temps."
            : "Compensation in line with the legal minimum and the official CCC price, paid on time."}
        </li>
        <li>
          {fr
            ? "Sécurité au travail : équipements de protection, formation, prévention des accidents lors de la récolte et du séchage."
            : "Workplace safety: protective equipment, training, accident prevention during harvest and drying."}
        </li>
        <li>
          {fr
            ? "Heures de travail conformes à la loi ; temps de repos garanti."
            : "Working hours compliant with the law; guaranteed rest time."}
        </li>
        <li>
          {fr
            ? "Accès à l'eau potable, à des installations sanitaires et, autant que possible, à une couverture santé via les mécanismes du pilier 4."
            : "Access to drinking water, sanitary facilities and, as far as possible, health coverage via Pillar 4 mechanisms."}
        </li>
      </ul>

      <h2>
        {fr ? "5. Engagements environnementaux" : "5. Environmental commitments"}
      </h2>
      <ul>
        <li>
          <strong>
            {fr ? "Zéro déforestation" : "Zero deforestation"} —
          </strong>{" "}
          {fr
            ? "aucune nouvelle parcelle issue d'une déforestation postérieure au 31 décembre 2020 (date butoir EUDR) n'est intégrée au réseau Asondo. Aucune fève produite sur une telle parcelle n'est commercialisée."
            : "no new plot resulting from deforestation after 31 December 2020 (EUDR cut-off date) is added to the Asondo network. No bean produced on such a plot is sold."}
        </li>
        <li>
          <strong>{fr ? "Aires protégées" : "Protected areas"} —</strong>{" "}
          {fr
            ? "interdiction stricte d'exploiter dans une forêt classée, un parc national, une réserve ou toute zone protégée par la législation ivoirienne."
            : "strict prohibition on operating in a classified forest, national park, reserve or any area protected by Ivorian law."}
        </li>
        <li>
          <strong>
            {fr ? "Pesticides et phytosanitaires" : "Pesticides and phytosanitary products"} —
          </strong>{" "}
          {fr
            ? "respect strict des listes positives ivoiriennes et des limites maximales de résidus (LMR) UE. Pas d'utilisation de substances classées CMR sans encadrement technique."
            : "strict compliance with Ivorian positive lists and EU maximum residue limits (MRLs). No use of CMR-classified substances without technical supervision."}
        </li>
        <li>
          <strong>
            {fr ? "Eau, sol, biodiversité" : "Water, soil, biodiversity"} —
          </strong>{" "}
          {fr
            ? "pratiques agroforestières, rotation, ombrage, restauration des sols dégradés, conservation des essences locales et des zones humides."
            : "agroforestry, rotation, shade, restoration of degraded soils, conservation of local species and wetlands."}
        </li>
        <li>
          <strong>{fr ? "Déchets" : "Waste"} —</strong>{" "}
          {fr
            ? "gestion responsable des emballages phytosanitaires, valorisation des cabosses, économie circulaire."
            : "responsible management of phytosanitary packaging, valorisation of pods, circular economy."}
        </li>
      </ul>

      <h2>
        {fr ? "6. Intégrité commerciale" : "6. Business integrity"}
      </h2>
      <ul>
        <li>
          <strong>
            {fr ? "Anti-corruption" : "Anti-corruption"} —
          </strong>{" "}
          {fr
            ? "tolérance zéro. Aucun paiement informel à un agent public, douanier ou inspecteur."
            : "zero tolerance. No informal payment to a public agent, customs officer or inspector."}
        </li>
        <li>
          <strong>
            {fr ? "Loyauté" : "Loyalty"} —
          </strong>{" "}
          {fr
            ? "interdiction des fausses pesées, de la falsification des certificats CCC ou des polygones GPS, du mélange avec du cacao d'origine non documentée."
            : "false weighing, falsification of CCC certificates or GPS polygons, and mixing with cocoa of undocumented origin are prohibited."}
        </li>
        <li>
          <strong>
            {fr ? "Conflits d'intérêts" : "Conflicts of interest"} —
          </strong>{" "}
          {fr ? "déclaration transparente." : "transparent declaration."}
        </li>
        <li>
          <strong>
            {fr ? "Confidentialité" : "Confidentiality"} —
          </strong>{" "}
          {fr
            ? "les données acheteurs (volumes, prix, calendriers) sont protégées et ne sont jamais partagées hors du périmètre opérationnel."
            : "buyer data (volumes, prices, schedules) is protected and never shared outside the operational scope."}
        </li>
      </ul>

      <h2>
        {fr
          ? "7. Traçabilité et coopération avec le Compliance Officer"
          : "7. Traceability and cooperation with the Compliance Officer"}
      </h2>
      <p>
        {fr
          ? "Chaque coopérative partenaire fournit ses polygones GPS, ses listes de planteurs, ses volumes et ses dates de récolte au Compliance Officer EUDR Asondo. Elle accueille les audits de terrain, les vérifications d'identité parcellaire et les inspections sous préavis raisonnable. Toute fausse déclaration entraîne l'exclusion immédiate du réseau."
          : "Each partner cooperative provides its GPS polygons, farmer lists, volumes and harvest dates to the Asondo EUDR Compliance Officer. It welcomes field audits, plot-identity checks and inspections at reasonable notice. Any false declaration results in immediate exclusion from the network."}
      </p>

      <h2>
        {fr ? "8. Signalement d'alerte (whistleblowing)" : "8. Whistleblowing"}
      </h2>
      <p>
        {fr
          ? "Toute personne (planteur, employé, acheteur, riverain, tiers) peut signaler en toute confidentialité un manquement à ce code :"
          : "Any person (farmer, employee, buyer, neighbour, third party) may confidentially report a breach of this code:"}
      </p>
      <ul>
        <li>
          {fr ? "Email confidentiel" : "Confidential email"} :{" "}
          <a href="mailto:compliance@asondo.ci">compliance@asondo.ci</a>
        </li>
        <li>
          {fr ? "Voir aussi la procédure complète" : "See also the full procedure"} :{" "}
          <a href="/eudr/compliance-officer">
            {fr
              ? "Responsable Conformité EUDR"
              : "EUDR Compliance Officer"}
          </a>
        </li>
      </ul>
      <p>
        {fr
          ? "ASONDO SA protège l'identité du lanceur d'alerte et garantit l'absence de représailles."
          : "ASONDO SA protects the whistleblower's identity and guarantees no retaliation."}
      </p>

      <h2>{fr ? "9. Sanctions" : "9. Sanctions"}</h2>
      <p>
        {fr
          ? "Tout manquement entraîne une procédure graduée : alerte écrite, plan correctif accompagné, suspension temporaire, exclusion du réseau. Les cas pénaux (travail des enfants, déforestation, falsification de polygones) entraînent l'exclusion immédiate et le signalement aux autorités compétentes."
          : "Any breach triggers a graduated procedure: written alert, supported corrective plan, temporary suspension, network exclusion. Criminal cases (child labour, deforestation, polygon falsification) lead to immediate exclusion and reporting to the competent authorities."}
      </p>

      <h2>
        {fr
          ? "10. Adhésion et signature"
          : "10. Adherence and signature"}
      </h2>
      <p>
        {fr
          ? "Chaque coopérative partenaire signe ce code lors de son intégration au réseau Asondo. Une version contresignée est conservée par le Compliance Officer pendant la durée du partenariat, plus 5 ans, conformément aux exigences EUDR."
          : "Each partner cooperative signs this code upon joining the Asondo network. A countersigned version is held by the Compliance Officer for the duration of the partnership, plus 5 years, in line with EUDR requirements."}
      </p>

      <h2>{fr ? "11. Révision" : "11. Review"}</h2>
      <p>
        {fr
          ? "Ce code est revu annuellement par le Compliance Officer et la Direction Générale, et publié dans sa version courante sur asondo.ci/code-de-conduite."
          : "This code is reviewed annually by the Compliance Officer and Executive Management, and published in its current version at asondo.ci/code-de-conduite."}
      </p>
    </LegalShell>
  );
}
