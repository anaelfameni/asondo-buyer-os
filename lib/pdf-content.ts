/**
 * Textes éditoriaux du Buyer Assurance Pack (PDF).
 *
 * Volontairement séparé de `lib/translations.ts` :
 *   - Le ton est institutionnel (pitch deck buyer EU), pas marketing site.
 *   - Les contenus sont longs (mission, code of conduct, mapping légal)
 *     et alourdiraient le bundle web s'ils étaient mélangés.
 *
 * Le PDF n'est rendu que par `app/print/buyer-pack/page.tsx` (route
 * imprimable, exclue du sitemap, lue par Puppeteer).
 */

export type PdfLocale = "fr" | "en";

export interface PdfContent {
  cover: {
    title: string;
    subtitle: string;
    confidential: string;
    preparedFor: (buyer?: string) => string;
    versionLabel: string;
    licenceLabel: string;
    issuedOn: string;
  };
  common: {
    pageOf: (n: number, total: number) => string;
    confidentialFooter: string;
    sourceLabel: string;
    underNda: string;
    legalFooter: string;
    appendixLabel: string;
  };
  identity: {
    eyebrow: string;
    title: string;
    legalForm: string;
    licence: string;
    headquarters: string;
    leadership: string;
    languages: string;
    contact: string;
    mission: string;
    statsTitle: string;
    stats: { value: string; label: string }[];
  };
  evidence: {
    eyebrow: string;
    title: string;
    intro: string;
    statusLabels: { ready: string; almost: string; not: string; na: string };
    summaryLabels: {
      pillarsCompliant: string;
      itemsTotal: string;
      readinessLevel: string;
    };
    ndaNote: string;
  };
  supply: {
    eyebrow: string;
    title: string;
    intro: string;
    headquartersLabel: string;
    zonesLabel: string;
    coopsLabel: (n: number) => string;
    criteriaTitle: string;
    criteria: string[];
    ndaNote: string;
  };
  cert: {
    eyebrow: string;
    title: string;
    intro: string;
    licenceCccActive: string;
    licenceCccPending: string;
    rainforestStatus: { none: string; in_progress: string; certified: string };
    sntccLabel: string;
    sntccDetail: string;
    chainTitle: string;
    chainSteps: { label: string; control: string; doc: string }[];
  };
  csddd: {
    eyebrow: string;
    title: string;
    intro: string;
    grievanceTitle: string;
    grievanceChannels: string;
    grievanceSla: string;
    grievanceStats: string;
    codeTitle: string;
    codeItems: { title: string; body: string }[];
    mappingTitle: string;
    mappingRows: { framework: string; coverage: string }[];
  };
  closing: {
    eyebrow: string;
    title: string;
    stepsTitle: string;
    steps: { num: string; title: string; body: string }[];
    qrCaption: string;
    contactTitle: string;
    signatureLabel: string;
  };
}

/* -------------------------------------------------------------------- FR */
const fr: PdfContent = {
  cover: {
    title: "Buyer Assurance Pack",
    subtitle: "Côte d'Ivoire · Cacao tracé, prêt pour l'EUDR",
    confidential: "Confidentiel — usage du destinataire uniquement",
    preparedFor: (buyer) =>
      buyer ? `Préparé pour ${buyer}` : "Préparé pour les partenaires qualifiés",
    versionLabel: "Version",
    licenceLabel: "Licence Exportateur CCC",
    issuedOn: "Émis le",
  },
  common: {
    pageOf: (n, total) => `${n} / ${total}`,
    confidentialFooter: "CONFIDENTIEL · sous NDA",
    sourceLabel: "Source",
    underNda: "Détails disponibles sous NDA",
    legalFooter:
      "ASONDO SA · Société de droit ivoirien · Licence CCC 2025/26 · Document confidentiel à usage exclusif du destinataire identifié en couverture · © Asondo 2026 — Tous droits réservés.",
    appendixLabel: "Annexe",
  },
  identity: {
    eyebrow: "Fiche entreprise",
    title: "Asondo en bref",
    legalForm: "Forme juridique",
    licence: "Licence d'exportation",
    headquarters: "Siège social",
    leadership: "Direction",
    languages: "Langues de travail",
    contact: "Contact direct",
    mission:
      "Asondo exporte du cacao ivoirien tracé et durable, au bénéfice direct des producteurs. Notre métier : connecter les coopératives de petits planteurs aux acheteurs internationaux, avec une traçabilité bout-en-bout, des pratiques agricoles responsables et une conformité ancrée dans les exigences EUDR et CSDDD.",
    statsTitle: "Indicateurs clés",
    stats: [
      { value: "15", label: "années dans le négoce et la supply chain" },
      { value: "#1", label: "producteur mondial — Côte d'Ivoire" },
      { value: "EUDR", label: "matrice de preuves auditée" },
      { value: "3", label: "régions de sourcing actives" },
    ],
  },
  evidence: {
    eyebrow: "Conformité réglementaire",
    title: "Matrice de preuves EUDR",
    intro:
      "Lecture transparente de notre niveau de préparation au Règlement européen 2023/1115 sur la déforestation. Chaque pilier regroupe des engagements vérifiables ; un statut indicatif est attribué à chaque pilier sur la base de nos données publiques et des éléments fournis par notre direction.",
    statusLabels: {
      ready: "Conforme",
      almost: "Presque conforme",
      not: "Non conforme",
      na: "Hors périmètre EUDR",
    },
    summaryLabels: {
      pillarsCompliant: "Piliers conformes",
      itemsTotal: "Engagements totaux",
      readinessLevel: "Niveau de préparation",
    },
    ndaNote:
      "Preuves documentaires détaillées (certificats, rapports d'audit, registres parcellaires) communicables sur demande après signature d'un NDA.",
  },
  supply: {
    eyebrow: "Réseau d'approvisionnement",
    title: "Bassin de sourcing & coopératives partenaires",
    intro:
      "Notre réseau s'appuie sur trois bassins de sourcing complémentaires couvrant les principaux terroirs cacaoyers ivoiriens. La coordination opérationnelle est centralisée au siège de Treichville, à Abidjan.",
    headquartersLabel: "Siège & coordination",
    zonesLabel: "Bassins de sourcing",
    coopsLabel: (n) => `≈ ${n} coopératives partenaires`,
    criteriaTitle: "Critères de sélection des coopératives",
    criteria: [
      "Éthique et transparence du dirigeant",
      "Mise en œuvre effective des bonnes pratiques agricoles",
      "Cartographie des parcelles et âge moyen des plantations",
      "Alignement avec les engagements de durabilité Asondo",
    ],
    ndaNote:
      "Géolocalisation parcellaire fine et liste nominative des coopératives communicables sous NDA buyer-spécifique.",
  },
  cert: {
    eyebrow: "Certifications & traçabilité",
    title: "Certifications actives & chaîne de garde",
    intro:
      "Asondo opère sous licence CCC 2025/26 et participe au Système National de Traçabilité Café-Cacao (SNTCC). Une démarche de certification Rainforest Alliance est en cours.",
    licenceCccActive: "Licence CCC 2025/26 — active",
    licenceCccPending: "Licence CCC — en cours de renouvellement",
    rainforestStatus: {
      none: "Rainforest Alliance — non engagée",
      in_progress: "Rainforest Alliance — certification en cours",
      certified: "Rainforest Alliance — certifiée",
    },
    sntccLabel: "SNTCC — enregistrement en cours",
    sntccDetail:
      "Système National de Traçabilité Café-Cacao : enrôlement des coopératives, géolocalisation parcellaire et carte producteur en cours de déploiement.",
    chainTitle: "Chaîne de traçabilité bout-en-bout",
    chainSteps: [
      {
        label: "Coopérative",
        control: "Pesée producteur, contrôle humidité",
        doc: "Bon de pesée numéroté",
      },
      {
        label: "Centre de collecte",
        control: "Échantillonnage qualité, fermentation",
        doc: "Bordereau de centre",
      },
      {
        label: "Siège Asondo",
        control: "Agréage CCC, lot ID, scellage",
        doc: "Lot Passport interne",
      },
      {
        label: "Port d'Abidjan",
        control: "Phytosanitaire, embarquement",
        doc: "Bill of Lading + COC",
      },
      {
        label: "Buyer EU",
        control: "Réception & due diligence",
        doc: "Statement EUDR",
      },
    ],
  },
  csddd: {
    eyebrow: "Due diligence avancée",
    title: "Pont vers la CSDDD & droits humains",
    intro:
      "Au-delà du périmètre déforestation imposé par l'EUDR, Asondo se prépare aux exigences de la directive CSDDD (2027–2029) à travers un dispositif de due diligence droits humains et environnement appliqué à toute la chaîne de valeur.",
    grievanceTitle: "Mécanisme de remontée de plaintes",
    grievanceChannels:
      "Canaux : email dédié grievance@asondo.ci · ligne téléphonique dédiée · courrier postal au siège · relais coopératives.",
    grievanceSla:
      "Engagement de service : accusé de réception sous 5 jours ouvrés, première réponse sous 30 jours, objectif de résolution sous 90 jours.",
    grievanceStats:
      "Référence 2024 : 0 plainte formelle reçue. Mécanisme structuré déployé au 1er trimestre 2025. Premier rapport annuel prévu au 1er trimestre 2026.",
    codeTitle: "Code de conduite — engagements clés",
    codeItems: [
      {
        title: "Tolérance zéro travail des enfants & travail forcé",
        body: "Alignement strict sur les Conventions OIT 138 (âge minimum) et 182 (pires formes de travail des enfants), contrôle périodique des coopératives.",
      },
      {
        title: "Zéro déforestation après le 31 décembre 2020",
        body: "Application du cut-off EUDR (Article 2 du règlement 2023/1115), vérification croisée par cartographie parcellaire.",
      },
      {
        title: "Prix juste & primes de certification",
        body: "Versement intégral du prix officiel CCC bord-champ aux producteurs, sans retenue ; primes de certification reversées sans intermédiaire.",
      },
      {
        title: "Santé & sécurité au champ",
        body: "Aucun produit phytosanitaire interdit à l'UE ; équipements de protection individuelle distribués via les coopératives ; sensibilisation annuelle.",
      },
      {
        title: "Transparence de la chaîne de valeur",
        body: "Cartographie supply chain communicable au buyer sous NDA ; engagement de réponse aux audits buyer-mandatés.",
      },
    ],
    mappingTitle: "Cadres réglementaires couverts",
    mappingRows: [
      { framework: "EUDR — UE 2023/1115", coverage: "Déforestation, traçabilité parcellaire, due diligence opérateur" },
      { framework: "CSDDD — UE 2024/1760", coverage: "Droits humains, environnement, gouvernance, mécanisme de plaintes" },
      { framework: "OIT 138 & 182", coverage: "Âge minimum, pires formes de travail des enfants" },
      { framework: "Loi de vigilance FR 2017-399", coverage: "Plan de vigilance buyer applicable indirectement" },
    ],
  },
  closing: {
    eyebrow: "Prochaines étapes",
    title: "Comment engager une relation commerciale",
    stepsTitle: "Trois étapes simples",
    steps: [
      {
        num: "01",
        title: "Soumettre un RFQ",
        body: "Formulaire en ligne ou email direct au CEO. Réponse personnalisée sous 24 heures avec conditions FOB Abidjan ou CIF port EU.",
      },
      {
        num: "02",
        title: "Signer un NDA",
        body: "Accès aux preuves détaillées : géolocalisation parcellaire, certificats, rapports d'audit, contacts coopératives.",
      },
      {
        num: "03",
        title: "Échantillon & contrat",
        body: "Échantillon physique sous 14 jours par DHL. Contrat-cadre type ECC ou contrat sur-mesure selon le volume.",
      },
    ],
    qrCaption: "Scannez pour accéder au formulaire RFQ pré-rempli",
    contactTitle: "Votre interlocuteur direct",
    signatureLabel: "Signature de la direction",
  },
};

/* -------------------------------------------------------------------- EN */
const en: PdfContent = {
  cover: {
    title: "Buyer Assurance Pack",
    subtitle: "Côte d'Ivoire · EUDR-Ready Cocoa Sourcing",
    confidential: "Confidential — for the named recipient only",
    preparedFor: (buyer) =>
      buyer ? `Prepared for ${buyer}` : "Prepared for qualified partners",
    versionLabel: "Version",
    licenceLabel: "CCC Export Licence",
    issuedOn: "Issued on",
  },
  common: {
    pageOf: (n, total) => `${n} / ${total}`,
    confidentialFooter: "CONFIDENTIAL · under NDA",
    sourceLabel: "Source",
    underNda: "Details available under NDA",
    legalFooter:
      "ASONDO SA · Ivorian-incorporated company · CCC Licence 2025/26 · Confidential document for the exclusive use of the recipient named on the cover · © Asondo 2026 — All rights reserved.",
    appendixLabel: "Appendix",
  },
  identity: {
    eyebrow: "Company snapshot",
    title: "Asondo at a glance",
    legalForm: "Legal form",
    licence: "Export licence",
    headquarters: "Headquarters",
    leadership: "Leadership",
    languages: "Working languages",
    contact: "Direct contact",
    mission:
      "Asondo exports traceable, sustainable Ivorian cocoa for the direct benefit of farmers. Our role: bridging cooperatives of smallholder producers with international buyers, through end-to-end traceability, responsible agronomic practice, and compliance anchored in EUDR and CSDDD requirements.",
    statsTitle: "Key indicators",
    stats: [
      { value: "15", label: "years in soft commodity trading" },
      { value: "#1", label: "global cocoa producer — Côte d'Ivoire" },
      { value: "EUDR", label: "audited evidence matrix" },
      { value: "3", label: "active sourcing regions" },
    ],
  },
  evidence: {
    eyebrow: "Regulatory readiness",
    title: "EUDR Evidence Matrix",
    intro:
      "Transparent view of our readiness against EU Regulation 2023/1115 on deforestation. Each pillar groups verifiable commitments; a status is attributed to each pillar on the basis of our public data and direction-confirmed evidence.",
    statusLabels: {
      ready: "Compliant",
      almost: "Almost compliant",
      not: "Not compliant",
      na: "Out of EUDR scope",
    },
    summaryLabels: {
      pillarsCompliant: "Compliant pillars",
      itemsTotal: "Total commitments",
      readinessLevel: "Readiness level",
    },
    ndaNote:
      "Detailed documentary evidence (certificates, audit reports, plot-level registries) shareable upon request after NDA signature.",
  },
  supply: {
    eyebrow: "Supply network",
    title: "Sourcing basins & partner cooperatives",
    intro:
      "Our network leans on three complementary sourcing basins covering the main Ivorian cocoa terroirs. Operational coordination is centralised at our Treichville headquarters in Abidjan.",
    headquartersLabel: "Headquarters & coordination",
    zonesLabel: "Sourcing basins",
    coopsLabel: (n) => `≈ ${n} partner cooperatives`,
    criteriaTitle: "Cooperative selection criteria",
    criteria: [
      "Leader ethics and transparency",
      "Effective implementation of agronomic best practices",
      "Plot mapping and average plantation age",
      "Alignment with Asondo sustainability commitments",
    ],
    ndaNote:
      "Granular plot geolocation and named cooperative list shareable under buyer-specific NDA.",
  },
  cert: {
    eyebrow: "Certifications & chain of custody",
    title: "Active certifications & chain of custody",
    intro:
      "Asondo operates under the CCC 2025/26 licence and participates in the National Coffee-Cocoa Traceability System (SNTCC). A Rainforest Alliance certification process is in progress.",
    licenceCccActive: "CCC Licence 2025/26 — active",
    licenceCccPending: "CCC Licence — renewal in progress",
    rainforestStatus: {
      none: "Rainforest Alliance — not engaged",
      in_progress: "Rainforest Alliance — certification in progress",
      certified: "Rainforest Alliance — certified",
    },
    sntccLabel: "SNTCC — registration in progress",
    sntccDetail:
      "National Coffee-Cocoa Traceability System: cooperative enrolment, plot geolocation and farmer ID card rollout in progress.",
    chainTitle: "End-to-end chain of custody",
    chainSteps: [
      {
        label: "Cooperative",
        control: "Producer weighing, moisture check",
        doc: "Numbered weighing slip",
      },
      {
        label: "Collection centre",
        control: "Quality sampling, fermentation",
        doc: "Centre delivery note",
      },
      {
        label: "Asondo HQ",
        control: "CCC grading, lot ID, sealing",
        doc: "Internal Lot Passport",
      },
      {
        label: "Abidjan port",
        control: "Phytosanitary, loading",
        doc: "Bill of Lading + COC",
      },
      {
        label: "EU buyer",
        control: "Reception & due diligence",
        doc: "EUDR statement",
      },
    ],
  },
  csddd: {
    eyebrow: "Advanced due diligence",
    title: "Bridging into CSDDD & human rights",
    intro:
      "Beyond the deforestation perimeter set by EUDR, Asondo is preparing for the CSDDD directive (2027–2029) through a human-rights and environmental due diligence framework applied across the value chain.",
    grievanceTitle: "Grievance mechanism",
    grievanceChannels:
      "Channels: dedicated email grievance@asondo.ci · dedicated phone line · postal mail to headquarters · cooperative relays.",
    grievanceSla:
      "Service commitment: acknowledgement within 5 business days, initial response within 30 days, target resolution within 90 days.",
    grievanceStats:
      "2024 baseline: 0 formal grievances received. Structured mechanism deployed Q1 2025. First annual report scheduled Q1 2026.",
    codeTitle: "Code of conduct — key commitments",
    codeItems: [
      {
        title: "Zero tolerance for child & forced labour",
        body: "Strict alignment with ILO Conventions 138 (minimum age) and 182 (worst forms of child labour); periodic cooperative checks.",
      },
      {
        title: "Zero deforestation after 31 December 2020",
        body: "Strict EUDR cut-off (Article 2 of Regulation 2023/1115) verified through plot-level cross-mapping.",
      },
      {
        title: "Fair price & certification premiums",
        body: "Full official CCC farm-gate price paid to producers without deduction; certification premiums passed through without intermediary.",
      },
      {
        title: "Health & safety in the field",
        body: "No EU-banned agrochemicals; PPE distributed via cooperatives; annual awareness campaigns.",
      },
      {
        title: "Supply chain transparency",
        body: "Supply chain mapping shareable with buyers under NDA; commitment to respond to buyer-mandated audits.",
      },
    ],
    mappingTitle: "Regulatory frameworks covered",
    mappingRows: [
      { framework: "EUDR — EU 2023/1115", coverage: "Deforestation, plot-level traceability, operator due diligence" },
      { framework: "CSDDD — EU 2024/1760", coverage: "Human rights, environment, governance, grievance mechanism" },
      { framework: "ILO 138 & 182", coverage: "Minimum age, worst forms of child labour" },
      { framework: "FR Duty of Vigilance Act 2017-399", coverage: "Buyer vigilance plan, applicable indirectly" },
    ],
  },
  closing: {
    eyebrow: "Next steps",
    title: "How to engage a commercial relationship",
    stepsTitle: "Three simple steps",
    steps: [
      {
        num: "01",
        title: "Submit an RFQ",
        body: "Online form or direct email to the CEO. Tailored response within 24 hours with FOB Abidjan or CIF EU port terms.",
      },
      {
        num: "02",
        title: "Sign an NDA",
        body: "Access to detailed evidence: plot geolocation, certificates, audit reports, cooperative contacts.",
      },
      {
        num: "03",
        title: "Sample & contract",
        body: "Physical sample within 14 days via DHL. ECC framework contract or bespoke contract depending on volume.",
      },
    ],
    qrCaption: "Scan to access the pre-filled RFQ form",
    contactTitle: "Your direct contact",
    signatureLabel: "Direction signature",
  },
};

export const PDF_CONTENT: Record<PdfLocale, PdfContent> = { fr, en };
