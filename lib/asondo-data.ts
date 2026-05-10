export const asondoData = {
  identity: {
    name: "Asondo",
    tagline: "Your Ivorian cocoa bean exporter.",
    experience: "15 years in soft commodity trading and supply chain",
    licence: "CCC Licensed Exporter 2025/26",
    address: "01 BP 4791 ABJ 01, Treichville, zone 3, Rue des ferronniers, immeuble le blason 3ème étage",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    phone: "+225 07 99 85 29 16",
    email: "admin@asondo.ci",
    website: "https://asondo.ci",
    founded: "After 15 years in trading (est. ~2010-2015)",
  },

  values: [
    { name: "Commitment", description: "Protecting and enhancing the Ivorian cocoa heritage" },
    { name: "Transparency", description: "Openness, information and knowledge sharing across the cocoa value chain" },
    { name: "Excellence", description: "High expectations and standards through the quality of our services" },
    { name: "Entrepreneurship", description: "Influencing positive change to create additional value for farmers" },
  ],

  pillars: [
    {
      id: "traceability",
      name: "Traceability",
      icon: "MapPin",
      items: [
        "Product sourcing control",
        "Transparency of our supply chain",
        "Quality assurance of our products",
      ],
      eudrStatus: "almost-ready" as const,
      eudrProof: null,
    },
    {
      id: "restoration",
      name: "Restoration & Conservation",
      icon: "TreePine",
      items: [
        "Effective combat against climate change",
        "Stopping deforestation in our supply basins",
        "Improving conservation of all protected areas",
        "Identifying and conserving areas of importance",
        "Soil regeneration",
        "Restoring degraded areas",
      ],
      eudrStatus: "almost-ready" as const,
      eudrProof: null,
    },
    {
      id: "resilience",
      name: "Resilience & Profit",
      icon: "TrendingUp",
      items: [
        "Payment of official CCC price and certification premiums",
        "Gender promotion",
        "Protection of children",
        "Plantation renewal, diversification and agroforestry",
        "Circular economy",
        "Regenerative and attractive agriculture for young people",
        "Community Development",
      ],
      eudrStatus: "ready" as const,
      eudrProof: "https://asondo.ci/en/our-program/",
    },
    {
      id: "banking",
      name: "Banking & Inclusion",
      icon: "Wallet",
      items: [
        "Mobile banking infrastructure for our farmer network",
        "Insurance (health, accident, death) for farmers",
        "Property insurance",
        "Facilitation of access to loans through field presence",
        "Promotion of AVEC (Village Savings & Loans Associations)",
      ],
      eudrStatus: "na" as const,
      eudrProof: null,
    },
  ],

  supplyZones: [
    {
      name: "Headquarters & Coordination",
      region: "Abidjan",
      department: "Treichville",
      type: "office" as const,
      lat: 5.3096,
      lng: -4.0126,
      accuracy: "exact" as const,
      description: "Asondo headquarters and logistics coordination",
    },
    {
      name: "Sourcing Region: Central Ivory Coast",
      region: "Bouaké / Yamoussoukro area",
      department: "Gôh / Lôh-Djiboua / Marahoué",
      type: "sourcing-region" as const,
      lat: 6.7,
      lng: -5.0,
      accuracy: "approximate" as const,
      description: "Cooperative network sourcing area. Detailed geolocation available under NDA.",
    },
    {
      name: "Sourcing Region: Eastern Ivory Coast",
      region: "Abengourou / Aboisso area",
      department: "Indénié-Djuablin / Sud-Comoé",
      type: "sourcing-region" as const,
      lat: 6.7,
      lng: -3.5,
      accuracy: "approximate" as const,
      description: "Cooperative network sourcing area. Detailed geolocation available under NDA.",
    },
    {
      name: "Sourcing Region: Western Ivory Coast",
      region: "Daloa / San-Pédro area",
      department: "Haut-Sassandra / San-Pédro",
      type: "sourcing-region" as const,
      lat: 6.9,
      lng: -6.4,
      accuracy: "approximate" as const,
      description: "Cooperative network sourcing area. Detailed geolocation available under NDA.",
    },
  ],

  services: {
    export: ["FOB Abidjan", "CIF European ports (Rotterdam, Hamburg, Antwerp)"],
    quality: ["Fermentation control", "Humidity <7.5%", "Broken beans control", "Custom quality on request"],
    traceability: ["Farmer group tracking", "Cooperative selection", "Direct link producers to international partners"],
  },

  certifications: [
    { name: "CCC Export Licence 2025/26", issuer: "Coffee and Cocoa Council (CCC)", status: "active" as const, url: "https://www.reuters.com/article/markets/commodities/ivory-coast-issues-109-cocoa-export-licences-for-2025-26-season-idUSL8N30K2XE/" },
    { name: "National Coffee-Cocoa Traceability System", issuer: "Government of Côte d'Ivoire", status: "in-progress" as const, url: "https://www.ecofinagency.com/public-management/1409-44854-cote-d-ivoire-introduces-national-coffee-and-cocoa-traceability-system" },
  ],

  stats: {
    yearsExperience: 15,
    cooperativesNetwork: "Carefully selected network",
    exportBasis: ["FOB", "CIF"],
    origin: "Côte d'Ivoire, #1 Global Cocoa Producer",
  },
};

export type EudrStatus = "ready" | "almost-ready" | "not-ready" | "na";

export const eudrStatusLabels: Record<EudrStatus, { label: string; color: string; bgColor: string }> = {
  ready: { label: "Ready", color: "#15803d", bgColor: "#dcfce7" },
  "almost-ready": { label: "Almost Ready", color: "#b45309", bgColor: "#fef3c7" },
  "not-ready": { label: "Not Ready", color: "#dc2626", bgColor: "#fee2e2" },
  na: { label: "N/A", color: "#6b7280", bgColor: "#f3f4f6" },
};
