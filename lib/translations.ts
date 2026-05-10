export type Locale = "fr" | "en";

export interface TranslationShape {
  nav: {
    evidence: string;
    network: string;
    programme: string;
    askUs: string;
    quote: string;
    requestQuote: string;
  };
  hero: {
    tagline: string;
    description: string;
    experience: string;
    origin: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statProducerWorld: string;
    statEudrReady: string;
    cards: {
      origineLabel: string;
      origineValue: string;
      origineDesc: string;
      missionLabel: string;
      missionLine1: string;
      missionHighlight: string;
      missionLine2: string;
      programmeLabel: string;
      programmeDesc: string;
    };
  };
  evidence: {
    title: string;
    subtitle: string;
    pillars: {
      traceability: { name: string; items: string[] };
      restoration: { name: string; items: string[] };
      resilience: { name: string; items: string[] };
      banking: { name: string; items: string[] };
    };
    status: {
      ready: string;
      almostReady: string;
      notReady: string;
      na: string;
    };
    viewSource: string;
    ndaNote: string;
    banner: {
      pillarsCompliant: string;
      almostCompliant: string;
      totalCommitments: string;
      readinessLabel: string;
    };
  };
  supply: {
    title: string;
    subtitle: string;
    mapPlaceholder: string;
    mapNote: string;
    headquarters: string;
    sourcingRegions: string;
    ndaNote: string;
    criteriaTitle: string;
    criteria: string[];
  };
  programme: {
    title: string;
    subtitle: string;
    commitments: string;
    across: string;
    itemsCount: string;
    mappingQuestion: string;
    viewMatrix: string;
  };
  ai: {
    title: string;
    subtitle: string;
    assistantName: string;
    replySpeed: string;
    placeholder: string;
    quickQuestions: string[];
  };
  rfq: {
    badge: string;
    title: string;
    subtitle: string;
    labels: {
      name: string;
      email: string;
      company: string;
      country: string;
      volume: string;
      port: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      company: string;
      country: string;
      volume: string;
      port: string;
      message: string;
    };
    submit: string;
    privacy: string;
    success: {
      title: string;
      message: string;
      followUp: string;
      reference: string;
    };
  };
  sample: {
    badge: string;
    title: string;
    subtitle: string;
    contents: string[];
    download: string;
    footer: string;
    alert: string;
  };
  footer: {
    tagline: string;
    contact: string;
    quickLinks: string;
    links: {
      eudr: string;
      network: string;
      programme: string;
      rfq: string;
    };
    copyright: string;
  };
  common: {
    loading: string;
    cocoaPartner: string;
  };
}

export const translations: Record<Locale, TranslationShape> = {
  fr: {
    nav: {
      evidence: "Conformité",
      network: "Réseau",
      programme: "Programme",
      askUs: "Assistant IA",
      quote: "Devis",
      requestQuote: "Demander un devis",
    },
    hero: {
      tagline: "Votre partenaire ivoirien pour l'export du cacao.",
      description: "Le cacao, héritage national ivoirien, a toujours été présent dans nos vies. Après 15 ans dans le négoce des matières premières et la supply chain, nous mettons notre expérience au service des défis du cacao ivoirien : lien direct entre partenaires internationaux et coopératives de petits producteurs, traçabilité complète, pratiques durables et conformité EUDR.",
      experience: "ans d'expérience",
      origin: "Côte d'Ivoire, 1er producteur mondial de cacao",
      ctaPrimary: "Vérifier notre conformité EUDR",
      ctaSecondary: "Demander un devis",
      statProducerWorld: "Producteur mondial",
      statEudrReady: "Ready",
      cards: {
        origineLabel: "Origine",
        origineValue: "Côte d'Ivoire",
        origineDesc: "Siège à Treichville, Abidjan. Sourcing dans 3 régions clés.",
        missionLabel: "Notre mission",
        missionLine1: "Exporter du cacao ivoirien",
        missionHighlight: "tracé et durable",
        missionLine2: ", au bénéfice des producteurs.",
        programmeLabel: "Engagements concrets",
        programmeDesc: "4 piliers : traçabilité, restauration, résilience, banque",
      },
    },
    evidence: {
      title: "Matrice de Preuves EUDR",
      subtitle: "Vue transparente de notre niveau de préparation au Règlement Européen sur la Déforestation. Chaque pilier est vérifiable de façon indépendante.",
      pillars: {
        traceability: {
          name: "Traçabilité",
          items: [
            "Contrôle de l'approvisionnement produit",
            "Transparence de notre chaîne d'approvisionnement",
            "Assurance qualité de nos produits",
          ],
        },
        restoration: {
          name: "Restauration & Conservation",
          items: [
            "Lutte efficace contre le changement climatique",
            "Arrêt de la déforestation dans nos bassins d'approvisionnement",
            "Amélioration de la conservation des aires protégées",
            "Identification et conservation des zones d'importance",
            "Régénération des sols",
            "Restauration des zones dégradées",
          ],
        },
        resilience: {
          name: "Résilience & Profit",
          items: [
            "Paiement du prix officiel CCC et primes de certification",
            "Promotion du genre",
            "Protection de l'enfance",
            "Renouvellement des plantations, diversification et agroforesterie",
            "Économie circulaire",
            "Agriculture régénératrice et attractive pour les jeunes",
            "Développement communautaire",
          ],
        },
        banking: {
          name: "Banque",
          items: [
            "Infrastructure de mobile banking pour notre réseau de producteurs",
            "Assurances (santé, accident, décès) pour les producteurs",
            "Assurance des biens",
            "Facilitation de l'accès au crédit grâce à notre présence terrain",
            "Promotion des AVEC (Associations Villageoises d'Épargne et de Crédit)",
          ],
        },
      },
      status: {
        ready: "Conforme",
        almostReady: "Presque conforme",
        notReady: "Non conforme",
        na: "N/A",
      },
      viewSource: "Voir la source publique",
      ndaNote: "Preuves détaillées disponibles sur demande ou sous NDA.",
      banner: {
        pillarsCompliant: "Piliers conformes",
        almostCompliant: "Presque conformes",
        totalCommitments: "Engagements totaux",
        readinessLabel: "Niveau de préparation EUDR",
      },
    },
    supply: {
      title: "Réseau d'approvisionnement",
      subtitle: "Le réseau de coopératives soigneusement sélectionnées d'Asondo à travers la Côte d'Ivoire. Siège à Abidjan avec un sourcing dans les principales régions cacaoyères.",
      mapPlaceholder: "Carte interactive",
      mapNote: "La carte Leaflet avec OpenStreetMap sera intégrée dans la prochaine mise à jour. En attendant, explorez nos régions de sourcing ci-dessous.",
      headquarters: "Siège social",
      sourcingRegions: "Régions de sourcing",
      ndaNote: "Géolocalisation détaillée des coopératives disponible sous NDA.",
      criteriaTitle: "Critères de sélection des coopératives",
      criteria: [
        "Éthique et transparence du dirigeant",
        "Bonnes pratiques agricoles",
        "Zone de production et âge des plantations",
        "Alignement avec la vision Asondo",
      ],
    },
    programme: {
      title: "Le programme Asondo",
      subtitle: "Notre programme de durabilité complet à 4 piliers.",
      commitments: "engagements concrets",
      across: "à travers traçabilité, restauration, résilience et banque.",
      itemsCount: "engagements",
      mappingQuestion: "Vous voulez voir comment ces piliers s'alignent à la conformité EUDR ?",
      viewMatrix: "Voir la matrice de preuves EUDR",
    },
    ai: {
      title: "Demandez à Asondo",
      subtitle: "Obtenez des réponses instantanées sur notre cacao, la traçabilité et la conformité EUDR.",
      assistantName: "Assistant IA Asondo",
      replySpeed: "Répond généralement instantanément",
      placeholder: "Posez une question sur EUDR, traçabilité, prix...",

      quickQuestions: [
        "Êtes-vous prêts pour l'EUDR ?",
        "Quel est votre système de traçabilité ?",
        "Demander un devis",
        "Télécharger le Buyer Pack",
      ],
    },
    rfq: {
      badge: "Réponse en moins de 24h",
      title: "Demande de devis",
      subtitle: "Précisez votre besoin. Notre équipe vous prépare une offre personnalisée sous 24 heures.",
      labels: {
        name: "Nom complet *",
        email: "Email *",
        company: "Société *",
        country: "Pays *",
        volume: "Volume estimé (TM)",
        port: "Port de destination",
        message: "Message / Spécifications",
      },
      placeholders: {
        name: "Jean Dupont",
        email: "jean@entreprise.com",
        company: "Votre Entreprise SARL",
        country: "France",
        volume: "100",
        port: "Rotterdam / Hamburg / Antwerp",
        message: "Précisez vos exigences qualité, calendrier de livraison et besoins particuliers...",
      },
      submit: "Envoyer la demande",
      privacy: "En soumettant ce formulaire, vous acceptez notre politique de confidentialité. Vos données ne seront utilisées que pour traiter votre demande.",
      success: {
        title: "Demande reçue !",
        message: "Une confirmation a été envoyée à",
        followUp: ". Notre équipe vous répondra sous 24 heures.",
        reference: "Référence",
      },
    },
    sample: {
      badge: "Téléchargement gratuit",
      title: "Échantillon Buyer Assurance Pack",
      subtitle: "Voyez exactement ce que reçoivent les acheteurs vérifiés lorsqu'ils demandent notre documentation complète. Cet échantillon contient nos preuves publiques et un aperçu du programme.",
      contents: [
        "Profil de l'entreprise & Licence CCC",
        "Matrice de preuves EUDR (4 piliers)",
        "Aperçu du réseau d'approvisionnement",
        "Synthèse du programme Asondo",
      ],
      download: "Télécharger l'échantillon (PDF)",
      footer: "Buyer Pack complet avec preuves détaillées disponible aux acheteurs vérifiés sous NDA.",
      alert: "Le Sample Buyer Pack sera disponible en Phase 3 (J+15). Pour l'instant, explorez la matrice de preuves ci-dessus !",
    },
    footer: {
      tagline: "Engagés pour une filière cacao durable et compétitive. Export de cacao ivoirien traçable vers le monde.",
      contact: "Contact",
      quickLinks: "Liens rapides",
      links: {
        eudr: "Preuves EUDR",
        network: "Réseau",
        programme: "Programme",
        rfq: "Demander un devis",
      },
      copyright: "Exportateur agréé CCC 2025/26.",
    },
    common: {
      loading: "Chargement...",
      cocoaPartner: "Votre partenaire ivoirien pour l'export du cacao",
    },
  },
  en: {
    nav: {
      evidence: "Evidence",
      network: "Network",
      programme: "Programme",
      askUs: "Ask AI",
      quote: "Quote",
      requestQuote: "Request a quote",
    },
    hero: {
      tagline: "Your Ivorian cocoa export partner.",
      description: "Cocoa, a quintessentially Ivorian national heritage, has always been present in our lives. After 15 years in soft commodity trading and supply chain, we now bring our experience to tackle Ivorian cocoa procurement challenges: a direct link between international partners and groups of small Ivorian cocoa producers, full traceability, sustainable practices and EUDR compliance.",
      experience: "years experience",
      origin: "Côte d'Ivoire, #1 Global Cocoa Producer",
      ctaPrimary: "Verify Our EUDR Readiness",
      ctaSecondary: "Request a Quote",
      statProducerWorld: "Global producer",
      statEudrReady: "Ready",
      cards: {
        origineLabel: "Origin",
        origineValue: "Côte d'Ivoire",
        origineDesc: "HQ in Treichville, Abidjan. Sourcing in 3 key regions.",
        missionLabel: "Our mission",
        missionLine1: "Export Ivorian cocoa,",
        missionHighlight: "traced and sustainable",
        missionLine2: ", for the benefit of producers.",
        programmeLabel: "Concrete commitments",
        programmeDesc: "4 pillars: traceability, restoration, resilience, banking",
      },
    },
    evidence: {
      title: "EUDR Evidence Matrix",
      subtitle: "Transparent view of our readiness for the EU Deforestation Regulation. Each pillar is independently verifiable.",
      pillars: {
        traceability: {
          name: "Traceability",
          items: [
            "Product sourcing control",
            "Transparency of our supply chain",
            "Quality assurance of our products",
          ],
        },
        restoration: {
          name: "Restoration & Conservation",
          items: [
            "Effective combat against climate change",
            "Stopping deforestation in our supply basins",
            "Improving conservation of all protected areas",
            "Identifying and conserving areas of importance",
            "Soil regeneration",
            "Restoring degraded areas",
          ],
        },
        resilience: {
          name: "Resilience & Profit",
          items: [
            "Payment of official CCC price and certification premiums",
            "Gender promotion",
            "Protection of children",
            "Plantation renewal, diversification and agroforestry",
            "Circular economy",
            "Regenerative and attractive agriculture for young people",
            "Community Development",
          ],
        },
        banking: {
          name: "Banking",
          items: [
            "Mobile banking infrastructure for our farmer network",
            "Insurance (health, accident, death) for farmers",
            "Property insurance",
            "Facilitation of access to loans through our field presence",
            "Promotion of AVEC (Village Savings & Loans Associations)",
          ],
        },
      },
      status: {
        ready: "Ready",
        almostReady: "Almost Ready",
        notReady: "Not Ready",
        na: "N/A",
      },
      viewSource: "View public source",
      ndaNote: "Detailed evidence available upon request or under NDA.",
      banner: {
        pillarsCompliant: "Compliant pillars",
        almostCompliant: "Almost compliant",
        totalCommitments: "Total commitments",
        readinessLabel: "EUDR readiness level",
      },
    },
    supply: {
      title: "Supply Network",
      subtitle: "Asondo's carefully selected cooperative network across Côte d'Ivoire. Headquartered in Abidjan with sourcing reach in major cocoa-producing regions.",
      mapPlaceholder: "Interactive Map",
      mapNote: "Leaflet map with OpenStreetMap will be integrated in the next update. For now, explore our sourcing regions below.",
      headquarters: "Headquarters",
      sourcingRegions: "Sourcing Regions",
      ndaNote: "Detailed cooperative geolocation available under NDA.",
      criteriaTitle: "Cooperative Selection Criteria",
      criteria: [
        "Leader ethics & transparency",
        "Agricultural good practices",
        "Production area & farm age",
        "Alignment with Asondo vision",
      ],
    },
    programme: {
      title: "The Asondo Programme",
      subtitle: "Our comprehensive 4-pillar sustainability programme.",
      commitments: "concrete commitments",
      across: "across traceability, restoration, resilience, and banking.",
      itemsCount: "commitments",
      mappingQuestion: "Want to see how these pillars map to EUDR compliance?",
      viewMatrix: "View EUDR Evidence Matrix",
    },
    ai: {
      title: "Ask Asondo Anything",
      subtitle: "Get instant answers about our cocoa, traceability, and EUDR readiness.",
      assistantName: "Asondo AI Assistant",
      replySpeed: "Typically replies instantly",
      placeholder: "Ask about EUDR, traceability, pricing...",
      quickQuestions: [
        "Are you EUDR ready?",
        "What's your traceability system?",
        "Request a quote",
        "Download Buyer Pack",
      ],
    },
    rfq: {
      badge: "Response in < 24 hours",
      title: "Request a Quote",
      subtitle: "Tell us your requirements. Our team will prepare a tailored offer within 24 hours.",
      labels: {
        name: "Full Name *",
        email: "Email *",
        company: "Company *",
        country: "Country *",
        volume: "Estimated Volume (MT)",
        port: "Destination Port",
        message: "Message / Requirements",
      },
      placeholders: {
        name: "John Smith",
        email: "john@company.com",
        company: "Your Company GmbH",
        country: "Germany",
        volume: "100",
        port: "Rotterdam / Hamburg / Antwerp",
        message: "Tell us about your quality requirements, delivery schedule, and any specific needs...",
      },
      submit: "Send Request",
      privacy: "By submitting, you agree to our privacy policy. Your data will only be used to process your request.",
      success: {
        title: "Request Received!",
        message: "We've sent a confirmation to",
        followUp: ". Our team will respond within 24 hours.",
        reference: "Reference",
      },
    },
    sample: {
      badge: "Free Download",
      title: "Sample Buyer Assurance Pack",
      subtitle: "See exactly what verified buyers receive when they request our full documentation. This sample includes our public evidence and programme overview.",
      contents: [
        "Company Profile & CCC Licence",
        "EUDR Evidence Matrix (4 pillars)",
        "Supply Network Overview",
        "Programme Dashboard Summary",
      ],
      download: "Download Sample Pack (PDF)",
      footer: "Full Buyer Pack with detailed evidence available to verified buyers under NDA.",
      alert: "Sample Buyer Pack will be available in Phase 3 (J+15). For now, explore the Evidence Matrix above!",
    },
    footer: {
      tagline: "Committed to a sustainable and competitive cocoa value chain. Exporting traceable Ivorian cocoa to the world.",
      contact: "Contact",
      quickLinks: "Quick Links",
      links: {
        eudr: "EUDR Evidence",
        network: "Supply Network",
        programme: "Our Programme",
        rfq: "Request Quote",
      },
      copyright: "CCC Licensed Exporter 2025/26.",
    },
    common: {
      loading: "Loading...",
      cocoaPartner: "Your Ivorian cocoa export partner",
    },
  },
};

export type Translations = TranslationShape;
