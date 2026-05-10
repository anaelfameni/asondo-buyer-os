import type { Locale } from "./translations";

export interface ChatResponse {
  keywords: string[];
  response: string;
  followUp?: string[];
}

/**
 * Base de connaissance Asondo — alignée avec asondo.ci, notre programme de durabilité
 * à 4 piliers, la licence CCC et la préparation EUDR.
 *
 * Principe: ne répondre QUE sur des sujets Asondo/cacao/EUDR/Côte d'Ivoire/export.
 * Les questions hors périmètre reçoivent une réponse professionnelle de redirection.
 */
export const chatResponsesByLocale: Record<Locale, ChatResponse[]> = {
  fr: [
    // 1. Salutations
    {
      keywords: ["bonjour", "salut", "hello", "hi", "hey", "bonsoir", "coucou"],
      response: "Bonjour ! Je suis l'assistant Asondo. Je peux répondre à vos questions sur notre cacao ivoirien, la traçabilité, la conformité EUDR, nos prix et notre programme de durabilité. Comment puis-je vous aider ?",
      followUp: ["Conformité EUDR", "Demander un devis", "Notre traçabilité", "Qui est Asondo ?"],
    },
    // 2. Qui est Asondo / Identité
    {
      keywords: ["qui est asondo", "qui êtes", "presentation", "présentation", "entreprise", "company", "about", "who are", "histoire", "history", "fondation", "founded"],
      response: "Asondo est une entreprise ivoirienne spécialisée dans l'export du cacao. Basée à Treichville, Abidjan, notre mission : construire une chaîne d'approvisionnement en cacao tracée, durable et équitable au bénéfice des producteurs. Nous sommes agréés par le Conseil Café-Cacao (CCC) pour la saison 2025/26 et alignons nos pratiques avec les standards FCC et Rainforest Alliance.",
      followUp: ["Notre mission", "Licence CCC", "Nous contacter"],
    },
    // 3. Mission / Vision
    {
      keywords: ["mission", "vision", "valeur", "values", "objectif", "objective", "pourquoi", "why"],
      response: "Notre mission chez Asondo : être le partenaire ivoirien de confiance pour l'export du cacao en proposant un produit tracé et durable. Nos valeurs : intégrité, transparence, durabilité et impact positif sur les communautés productrices. Notre programme à 4 piliers traduit concrètement ces valeurs en 21 engagements.",
      followUp: ["Notre programme", "Protection enfance", "Matrice de preuves"],
    },
    // 4. EUDR / Conformité
    {
      keywords: ["eudr", "déforestation", "deforestation", "règlement", "regulation", "conformité", "compliance", "prêt", "ready", "règlementation", "européen", "europe"],
      response: "Asondo prépare activement sa conformité EUDR (règlement UE 2023/1115). Notre programme à 4 piliers couvre : (1) la traçabilité des parcelles, (2) la prévention de la déforestation, (3) la résilience des producteurs, (4) l'inclusion bancaire. Nous opérons via le Système National de Traçabilité Café-Cacao (SNTCC) et la plateforme OCS. Notre Matrice de Preuves EUDR détaille le statut de chaque pilier.",
      followUp: ["Matrice de preuves", "Télécharger le Buyer Pack", "Géolocalisation"],
    },
    // 5. Traçabilité / Géolocalisation
    {
      keywords: ["traçabilité", "tracabilite", "traceability", "géolocalisation", "geolocalisation", "geolocation", "gps", "ferme", "farm", "parcelle", "plot", "origine", "origin"],
      response: "Notre traçabilité repose sur une chaîne courte : coopérative → siège Asondo → port d'Abidjan. Nous travaillons avec des coopératives sélectionnées dans le Centre, l'Est et l'Ouest de la Côte d'Ivoire. La géolocalisation des parcelles est opérée via le SNTCC et partagée avec les acheteurs vérifiés sous NDA, conformément au protocole EUDR.",
      followUp: ["Voir la carte", "Nos coopératives", "Demander la géolocalisation sous NDA"],
    },
    // 6. Prix / Pricing / Devis
    {
      keywords: ["prix", "price", "cout", "coût", "cost", "cif", "fob", "devis", "quote", "combien", "tarif", "pricing", "incoterm"],
      response: "Nous proposons du cacao en fèves sous les incoterms FOB Abidjan et CIF ports européens (Rotterdam, Hambourg, Anvers). Le prix indexe le cours officiel CCC du jour auquel s'ajoutent : prime qualité, prime durabilité (LID Living Income Differential), logistique et assurance. Volume minimum, paiement et calendrier sont discutés au cas par cas.",
      followUp: ["Demander un devis", "FOB vs CIF", "Spécifications qualité"],
    },
    // 7. Qualité / Spécifications
    {
      keywords: ["qualité", "qualite", "quality", "humidité", "humidite", "humidity", "fermentation", "fève", "feve", "bean", "spécification", "specification", "grade"],
      response: "Nos fèves respectent les standards d'export Côte d'Ivoire : humidité ≤ 7,5 %, fèves défectueuses ≤ 10 %, grainage homogène, fermentation complète. Conditionnement standard : sacs de jute 60-64 kg ou GrainPro pour préserver l'arôme. Profils qualité spécifiques (grade I, bio, longue fermentation) disponibles sur cahier des charges.",
      followUp: ["Demander un échantillon", "Conditionnement", "Certifications"],
    },
    // 8. Licence CCC
    {
      keywords: ["ccc", "licence", "license", "agrément", "agrement", "export", "exportateur", "autorisé", "autorise", "authorized", "conseil café", "café cacao"],
      response: "Asondo figure sur la liste officielle des exportateurs agréés par le Conseil du Café-Cacao (CCC) pour la saison 2025/26. Le CCC est l'organisme public ivoirien qui régule la filière, fixe les prix de campagne et délivre les agréments d'export. Notre attestation d'agrément est jointe au Buyer Assurance Pack.",
      followUp: ["Télécharger le Buyer Pack", "Autres certifications", "Calendrier de saison"],
    },
    // 9. Durabilité / Certifications
    {
      keywords: ["durable", "durabilité", "durabilite", "sustainable", "sustainability", "équitable", "equitable", "fair", "bio", "organic", "certification", "rainforest", "fairtrade", "label"],
      response: "La durabilité est au cœur d'Asondo : arrêt de la déforestation, restauration des sols, protection de l'enfance, promotion du genre, développement communautaire. Nous alignons nos pratiques avec les standards Rainforest Alliance et FCC. Certifications spécifiques (Rainforest Alliance, Fairtrade, Bio) disponibles sur demande et selon la coopérative source.",
      followUp: ["Notre programme", "Protection enfance", "Restauration"],
    },
    // 10. Protection enfance / Gender / Social
    {
      keywords: ["enfance", "child", "children", "genre", "gender", "femme", "women", "social", "travail", "labour", "labor"],
      response: "Asondo refuse tout travail des enfants dans sa chaîne d'approvisionnement et applique un système de vigilance conforme aux standards ICI / CLMRS. Nous promouvons l'inclusion des femmes dans les coopératives et soutenons des projets d'alphabétisation, d'accès à la santé et à l'éducation dans les zones de sourcing.",
      followUp: ["Notre programme", "Développement communautaire", "Télécharger le Buyer Pack"],
    },
    // 11. Volume / Capacité
    {
      keywords: ["volume", "quantité", "quantite", "quantity", "tonne", "ton", "mt", "tm", "capacité", "capacite", "capacity", "stock"],
      response: "Notre capacité évolue selon la saison et le réseau de coopératives mobilisé. Nous traitons aussi bien des volumes de niche (containers dédiés) que des volumes industriels multi-containers. Pour un engagement précis, soumettez un RFQ avec votre volume cible, votre calendrier de livraison et votre destination.",
      followUp: ["Demander un devis", "Calendrier de saison", "Ports d'embarquement"],
    },
    // 12. Contact
    {
      keywords: ["contact", "email", "téléphone", "telephone", "phone", "appel", "call", "joindre", "reach", "manager", "whatsapp", "numéro", "numero"],
      response: "Vous pouvez joindre Asondo : Email admin@asondo.ci | Téléphone +225 07 99 85 29 16 | Adresse 01 BP 4791 ABJ 01, Treichville, Abidjan, Côte d'Ivoire | Site asondo.ci. Pour un devis chiffré, le formulaire RFQ ci-dessous est traité sous 24 h.",
      followUp: ["Demander un devis", "Site asondo.ci"],
    },
    // 13. Buyer Pack / Documents
    {
      keywords: ["buyer pack", "document", "pdf", "télécharger", "telecharger", "download", "preuve", "evidence", "dossier", "kit", "brochure"],
      response: "Notre Buyer Assurance Pack comprend : profil entreprise, agrément CCC, Matrice de Preuves EUDR, cartographie du réseau de sourcing, synthèse des certifications et échantillons de documents qualité. Il est disponible en téléchargement direct et en version étendue sous NDA pour les acheteurs vérifiés.",
      followUp: ["Télécharger l'échantillon", "Demander la version NDA", "Matrice EUDR"],
    },
    // 14. Saison / Calendrier
    {
      keywords: ["saison", "season", "calendrier", "calendar", "récolte", "recolte", "harvest", "campagne", "main crop", "mid crop", "octobre", "avril", "quand"],
      response: "La campagne principale (main crop) s'étend d'octobre à mars ; la campagne intermédiaire (mid crop) d'avril à septembre. Le CCC publie chaque année le prix bord champ et le calendrier des livraisons. Asondo programme ses expéditions en fonction de ces fenêtres et de la disponibilité qualité.",
      followUp: ["Disponibilité actuelle", "Demander un devis", "Licence CCC"],
    },
    // 15. Ports / Shipping
    {
      keywords: ["port", "abidjan", "san pedro", "shipping", "container", "expedition", "expédition", "logistique", "logistics", "transport", "jute", "grainpro"],
      response: "Nos expéditions partent principalement du port d'Abidjan (FOB). Conditionnement : sacs jute 60-64 kg, GrainPro ou vrac en container 20'/40' selon volume et exigences qualité. Documentation fournie : Bill of Lading, certificat d'origine (CCC), certificat phytosanitaire, factures commerciales.",
      followUp: ["Demander un devis", "Conditionnement", "Documents export"],
    },
    // 16. Documents / Certificats
    {
      keywords: ["certificat", "certificate", "origine", "phytosanitaire", "phytosanitary", "bill of lading", "bl", "facture", "invoice", "coa", "analyse"],
      response: "Chaque expédition Asondo est accompagnée de : certificat d'origine CCC, certificat phytosanitaire (Ministère de l'Agriculture), Bill of Lading, facture commerciale, packing list, certificat d'analyse (sur demande). Pour les lots certifiés, le certificat de la norme (Rainforest Alliance, Fairtrade) est joint.",
      followUp: ["Demander un devis", "Qualité et analyses", "Contact"],
    },
    // 17. Coopératives / Sourcing
    {
      keywords: ["coopérative", "cooperative", "cooperatives", "producteur", "producer", "farmer", "planteur", "réseau", "reseau", "network", "sourcing"],
      response: "Asondo travaille avec un réseau sélectionné de coopératives réparties dans le Centre, l'Est et l'Ouest de la Côte d'Ivoire. Critères de sélection : traçabilité GPS, absence de déforestation post-2020, gouvernance transparente, politique enfance, paiement équitable. La liste détaillée est partagée sous NDA.",
      followUp: ["Voir la carte", "Critères de sélection", "NDA"],
    },
    // 18. Paiement / Banking
    {
      keywords: ["paiement", "payment", "banque", "bank", "virement", "transfer", "lc", "letter of credit", "avance", "deposit", "terme", "terms"],
      response: "Conditions de paiement usuelles : virement SWIFT, LC à vue ou à échéance pour les commandes de gros volume, acompte à la signature pour les primo-acheteurs. Le pilier \"inclusion bancaire\" de notre programme vise aussi à déployer des solutions de paiement digitales (AVEC) pour les producteurs.",
      followUp: ["Demander un devis", "Conditions commerciales", "Contact"],
    },
    // 19. Programme / 4 piliers
    {
      keywords: ["programme", "4 piliers", "piliers", "pillars", "sustainability programme", "21 engagements", "commitments"],
      response: "Notre programme de durabilité comporte 4 piliers et 21 engagements concrets : (1) Traçabilité — cartographie GPS, SNTCC ; (2) Restauration — arrêt de la déforestation, plantation d'arbres d'ombrage ; (3) Résilience — diversification des revenus, formation ; (4) Inclusion bancaire — AVEC, accès au crédit pour les producteurs.",
      followUp: ["Matrice de preuves", "Protection enfance", "Restauration"],
    },
    // 20. Restauration / Arbres
    {
      keywords: ["restauration", "restoration", "arbre", "tree", "reforestation", "forêt", "foret", "biodiversité", "biodiversity", "agroforesterie", "agroforestry"],
      response: "Sous le pilier Restauration, nous promouvons l'agroforesterie (arbres d'ombrage endémiques, cultures vivrières intercalaires) et refusons toute parcelle défrichée après décembre 2020 (baseline EUDR). Des partenariats ONG nous accompagnent sur des projets pilotes de plantation.",
      followUp: ["Notre programme", "Matrice EUDR", "Coopératives"],
    },
    // 21. Résilience / Revenus
    {
      keywords: ["résilience", "resilience", "revenu", "income", "living income", "lid", "différentiel", "pauvreté", "poverty", "diversification"],
      response: "Le pilier Résilience vise à améliorer le revenu des producteurs via : paiement du LID (Living Income Differential) en plus du prix CCC, primes qualité, diversification des cultures, formations en bonnes pratiques agricoles, et appui à la structuration coopérative.",
      followUp: ["Notre programme", "Développement communautaire", "Paiement"],
    },
    // 22. Inclusion bancaire / AVEC
    {
      keywords: ["banque", "bank", "banking", "avec", "inclusion", "financial", "crédit", "credit", "épargne", "epargne", "savings", "mobile money"],
      response: "Le pilier Inclusion bancaire soutient les Associations Villageoises d'Épargne et de Crédit (AVEC), l'accès au mobile money et à des crédits adaptés pour les producteurs. Objectif : réduire la vulnérabilité financière et encourager l'investissement dans l'exploitation familiale.",
      followUp: ["Notre programme", "Résilience", "Coopératives"],
    },
    // 23. Site / Asondo.ci
    {
      keywords: ["site", "website", "asondo.ci", "web", "internet", "lien", "link"],
      response: "Notre site officiel est asondo.ci. Vous y trouverez notre présentation, notre équipe, notre programme de durabilité et les coordonnées pour nous joindre.",
      followUp: ["Nous contacter", "Télécharger le Buyer Pack"],
    },
  ],

  // ============ EN ============
  en: [
    {
      keywords: ["hello", "hi", "hey", "good morning", "good evening"],
      response: "Hello! I'm the Asondo assistant. I can help with questions about our Ivorian cocoa, traceability, EUDR compliance, pricing and our sustainability programme. How can I help?",
      followUp: ["EUDR readiness", "Request a quote", "Our traceability", "Who is Asondo?"],
    },
    {
      keywords: ["who is asondo", "about", "company", "presentation", "history", "founded"],
      response: "Asondo is an Ivorian company specialised in cocoa export. Based in Treichville, Abidjan, our mission is to build a traced, sustainable and fair cocoa supply chain that benefits producers. We are licensed by the Coffee-Cocoa Council (CCC) for the 2025/26 season and align with FCC and Rainforest Alliance standards.",
      followUp: ["Our mission", "CCC licence", "Contact us"],
    },
    {
      keywords: ["mission", "vision", "values", "purpose", "why"],
      response: "Our mission at Asondo: be Ivory Coast's trusted partner for cocoa export by delivering a traced and sustainable product. Our values: integrity, transparency, sustainability, positive impact on producer communities. Our 4-pillar programme translates these values into 21 concrete commitments.",
      followUp: ["Our programme", "Child protection", "Evidence matrix"],
    },
    {
      keywords: ["eudr", "deforestation", "regulation", "compliance", "ready", "europe"],
      response: "Asondo is actively preparing EUDR compliance (EU Regulation 2023/1115). Our 4-pillar programme covers: (1) plot-level traceability, (2) deforestation prevention, (3) farmer resilience, (4) banking inclusion. We operate via the National Coffee-Cocoa Traceability System (SNTCC) and the OCS platform. Our EUDR Evidence Matrix shows each pillar's status.",
      followUp: ["Evidence matrix", "Download Buyer Pack", "Geolocation"],
    },
    {
      keywords: ["traceability", "geolocation", "gps", "farm", "plot", "parcel", "origin"],
      response: "Our traceability is based on a short chain: cooperative → Asondo HQ → Port of Abidjan. We work with selected cooperatives in Central, Eastern and Western Côte d'Ivoire. Plot-level geolocation is handled through SNTCC and shared with verified buyers under NDA, in line with the EUDR protocol.",
      followUp: ["Supply map", "Our cooperatives", "Request geolocation under NDA"],
    },
    {
      keywords: ["price", "pricing", "cost", "cif", "fob", "quote", "how much", "rate", "incoterm"],
      response: "We offer cocoa beans on FOB Abidjan or CIF European ports (Rotterdam, Hamburg, Antwerp). Pricing indexes the daily CCC official rate plus quality premium, sustainability premium (LID Living Income Differential), logistics and insurance. Minimum volume, payment and schedule are discussed case-by-case.",
      followUp: ["Request a quote", "FOB vs CIF", "Quality specs"],
    },
    {
      keywords: ["quality", "humidity", "fermentation", "broken", "bean", "specification", "grade"],
      response: "Our beans meet Ivorian export standards: humidity ≤ 7.5%, defective beans ≤ 10%, homogeneous size, full fermentation. Standard packaging: 60-64 kg jute bags or GrainPro to preserve aroma. Specific quality profiles (Grade I, organic, extended fermentation) available on spec sheet.",
      followUp: ["Request a sample", "Packaging", "Certifications"],
    },
    {
      keywords: ["ccc", "licence", "license", "authorized", "export", "coffee cocoa council"],
      response: "Asondo is on the official list of exporters licensed by the Coffee-Cocoa Council (CCC) for the 2025/26 season. CCC is the Ivorian public body regulating the sector, setting farm-gate prices and issuing export licences. Our licence attestation is included in the Buyer Assurance Pack.",
      followUp: ["Download Buyer Pack", "Other certifications", "Season calendar"],
    },
    {
      keywords: ["sustainability", "sustainable", "fair", "organic", "certification", "rainforest", "fairtrade", "label"],
      response: "Sustainability is core to Asondo: deforestation-free sourcing, soil restoration, child protection, gender inclusion, community development. We align with Rainforest Alliance and FCC standards. Specific certifications (Rainforest Alliance, Fairtrade, organic) are available on demand and depending on the source cooperative.",
      followUp: ["Our programme", "Child protection", "Restoration"],
    },
    {
      keywords: ["child", "children", "gender", "women", "social", "labour", "labor"],
      response: "Asondo rejects any child labour in its supply chain and operates a vigilance system aligned with ICI / CLMRS standards. We promote women's inclusion in cooperatives and support literacy, healthcare and education projects in our sourcing areas.",
      followUp: ["Our programme", "Community development", "Download Buyer Pack"],
    },
    {
      keywords: ["volume", "quantity", "mt", "metric ton", "ton", "how many", "capacity", "stock"],
      response: "Our capacity scales with season and cooperative network. We handle both niche volumes (single container) and industrial multi-container orders. For a firm commitment, submit an RFQ with target volume, delivery schedule and destination.",
      followUp: ["Request a quote", "Season calendar", "Shipping ports"],
    },
    {
      keywords: ["contact", "email", "phone", "call", "reach", "whatsapp", "number"],
      response: "You can reach Asondo: Email admin@asondo.ci | Phone +225 07 99 85 29 16 | Address 01 BP 4791 ABJ 01, Treichville, Abidjan, Côte d'Ivoire | Website asondo.ci. For a priced quote, the RFQ form below is processed within 24 h.",
      followUp: ["Request a quote", "Visit asondo.ci"],
    },
    {
      keywords: ["buyer pack", "document", "pdf", "download", "evidence", "dossier", "kit", "brochure"],
      response: "Our Buyer Assurance Pack includes: company profile, CCC licence, EUDR Evidence Matrix, sourcing network map, certifications summary and quality document samples. Available for direct download; extended version shared under NDA for verified buyers.",
      followUp: ["Download sample", "Request NDA version", "EUDR Matrix"],
    },
    {
      keywords: ["season", "calendar", "harvest", "main crop", "mid crop", "october", "april", "when"],
      response: "Main crop: October to March. Mid crop: April to September. CCC publishes the yearly farm-gate price and delivery calendar. Asondo schedules shipments based on these windows and quality availability.",
      followUp: ["Current availability", "Request a quote", "CCC licence"],
    },
    {
      keywords: ["port", "abidjan", "san pedro", "shipping", "container", "logistics", "transport", "jute", "grainpro"],
      response: "Shipments primarily leave from the Port of Abidjan (FOB). Packaging: 60-64 kg jute bags, GrainPro or bulk in 20'/40' containers depending on volume and quality. Documentation provided: Bill of Lading, CCC certificate of origin, phytosanitary certificate, commercial invoices.",
      followUp: ["Request a quote", "Packaging", "Export documents"],
    },
    {
      keywords: ["certificate", "origin", "phytosanitary", "bill of lading", "bl", "invoice", "coa", "analysis"],
      response: "Every Asondo shipment comes with: CCC certificate of origin, phytosanitary certificate (Ministry of Agriculture), Bill of Lading, commercial invoice, packing list, certificate of analysis (on demand). Certified lots include the standard's own certificate (Rainforest Alliance, Fairtrade).",
      followUp: ["Request a quote", "Quality & analyses", "Contact"],
    },
    {
      keywords: ["cooperative", "cooperatives", "producer", "farmer", "network", "sourcing"],
      response: "Asondo works with a selected cooperative network in Central, Eastern and Western Côte d'Ivoire. Selection criteria: GPS traceability, no post-2020 deforestation, transparent governance, child-labour policy, fair payment. Detailed list shared under NDA.",
      followUp: ["Supply map", "Selection criteria", "NDA"],
    },
    {
      keywords: ["payment", "bank", "transfer", "lc", "letter of credit", "deposit", "terms"],
      response: "Typical payment terms: SWIFT wire, sight or usance LC for large volumes, deposit at signature for first-time buyers. Our \"banking inclusion\" pillar also aims to deploy digital payment tools (VSLA / AVEC) for producers.",
      followUp: ["Request a quote", "Commercial terms", "Contact"],
    },
    {
      keywords: ["programme", "4 pillar", "pillars", "21 commitments"],
      response: "Our sustainability programme has 4 pillars and 21 concrete commitments: (1) Traceability — GPS mapping, SNTCC; (2) Restoration — zero deforestation, shade tree planting; (3) Resilience — income diversification, training; (4) Banking inclusion — VSLA, credit access for producers.",
      followUp: ["Evidence matrix", "Child protection", "Restoration"],
    },
    {
      keywords: ["restoration", "tree", "reforestation", "forest", "biodiversity", "agroforestry"],
      response: "Under the Restoration pillar, we promote agroforestry (native shade trees, intercropping with food crops) and reject any plot cleared after December 2020 (EUDR baseline). NGO partnerships support pilot planting projects.",
      followUp: ["Our programme", "EUDR Matrix", "Cooperatives"],
    },
    {
      keywords: ["resilience", "income", "living income", "lid", "differential", "poverty", "diversification"],
      response: "The Resilience pillar aims to improve farmer income via: LID (Living Income Differential) payment on top of CCC price, quality premiums, crop diversification, best-practice training, and cooperative governance support.",
      followUp: ["Our programme", "Community development", "Payment"],
    },
    {
      keywords: ["banking", "vsla", "avec", "inclusion", "credit", "savings", "mobile money"],
      response: "The Banking Inclusion pillar supports Village Savings and Loan Associations (VSLA / AVEC), mobile money and tailored credit for producers. Goal: reduce financial vulnerability and encourage investment in family farms.",
      followUp: ["Our programme", "Resilience", "Cooperatives"],
    },
    {
      keywords: ["website", "asondo.ci", "web", "internet", "link"],
      response: "Our official website is asondo.ci. You'll find our presentation, team, sustainability programme and contact details.",
      followUp: ["Contact us", "Download Buyer Pack"],
    },
  ],
};

// ------- Fallback professionnel : question hors périmètre -------
export const defaultResponseByLocale: Record<Locale, ChatResponse> = {
  fr: {
    keywords: [],
    response: "Je suis l'assistant Asondo, spécialisé sur notre activité : cacao ivoirien, traçabilité, conformité EUDR, prix et durabilité. Votre question semble sortir de ce périmètre. Je peux vous orienter sur l'un des sujets ci-dessous, ou vous mettre en relation avec notre équipe à admin@asondo.ci.",
    followUp: ["Conformité EUDR", "Demander un devis", "Notre traçabilité", "Nous contacter"],
  },
  en: {
    keywords: [],
    response: "I'm the Asondo assistant, focused on our scope: Ivorian cocoa, traceability, EUDR compliance, pricing and sustainability. Your question seems outside this scope. I can redirect you to one of the topics below, or connect you with our team at admin@asondo.ci.",
    followUp: ["EUDR readiness", "Request a quote", "Our traceability", "Contact us"],
  },
};

// ------- Sujets clairement hors scope (politique, météo hors CI, recettes, etc.) -------
const outOfScopeKeywords = [
  // politique & international
  "politique", "politics", "élection", "election", "president", "président", "trump", "biden", "macron", "guerre", "war",
  // météo non-CI
  "weather in", "météo paris", "weather paris", "weather london",
  // recettes / consommation
  "recette", "recipe", "brownie", "gâteau", "cake", "cuisine", "cooking", "chocolat chaud", "hot chocolate",
  // général non-cacao
  "bitcoin", "crypto", "stock", "bourse", "action apple", "apple stock", "tesla",
  // dev / code
  "javascript", "python", "code", "programming", "bug", "error 404",
  // météo générale
  "météo", "weather", "temperature",
  // sports & loisirs
  "football", "soccer", "match", "psg", "real madrid", "cinema", "cinéma", "film",
];

function isOutOfScope(input: string): boolean {
  const lower = input.toLowerCase();
  // Si on détecte un mot hors-scope ET aucun mot cacao/asondo, on considère hors scope
  const containsOutOfScope = outOfScopeKeywords.some((k) => lower.includes(k));
  if (!containsOutOfScope) return false;
  const asondoKeywords = ["asondo", "cacao", "cocoa", "eudr", "ccc", "traçab", "traceab", "côte d'ivoire", "ivory coast", "abidjan"];
  const containsAsondo = asondoKeywords.some((k) => lower.includes(k));
  return !containsAsondo;
}

export function findResponse(input: string, locale: Locale = "fr"): ChatResponse {
  const lowerInput = input.toLowerCase();
  const responses = chatResponsesByLocale[locale];
  const fallback = defaultResponseByLocale[locale];

  // 1. Hors scope explicite → fallback pro
  if (isOutOfScope(lowerInput)) {
    return fallback;
  }

  // 2. Scoring pondéré sur les mots-clés
  let bestMatch: ChatResponse | null = null;
  let bestScore = 0;

  for (const response of responses) {
    // Score = nb de mots-clés trouvés, pondéré par la longueur du mot-clé pour favoriser
    // les correspondances spécifiques (ex: "traçabilité" > "gps")
    let score = 0;
    for (const k of response.keywords) {
      if (lowerInput.includes(k)) {
        score += Math.max(1, Math.floor(k.length / 3));
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = response;
    }
  }

  // 3. Aucun match → fallback pro
  return bestMatch ?? fallback;
}
