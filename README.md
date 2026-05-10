# Asondo Buyer Assurance OS — Mirror Demo

Vitrine publique de démonstration pour **Asondo SA**, exportateur agréé de cacao en Côte d'Ivoire (CCC 2025/26).

## Objectif

Présenter au CEO d'Asondo une preuve de concept fonctionnelle d'une vitrine acheteurs alignée EUDR :
- **HeroBanner** — Tagline + licence CCC + CTAs
- **Evidence Matrix** — Statut EUDR par pilier
- **Supply Map** — Réseau d'approvisionnement
- **Programme Dashboard** — 21 engagements
- **AI Copilot** — Assistant rule-based bilingue
- **RFQ Form** — Demande de devis < 24h
- **Sample Buyer Pack** — CTA téléchargement

## Bilingue FR/EN

Le site est en **français par défaut** avec un toggle EN dans la barre de navigation. La langue choisie est persistée dans `localStorage`.

## Stack (0 €)

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (Button, Card, Badge, Input, Label, Textarea)
- Lucide React (icônes)
- Inter (Google Fonts)
- React Context pour l'i18n

## Démarrer

```powershell
pnpm install
pnpm dev
# → http://localhost:3000
```

## Build production

```powershell
pnpm build
pnpm start
```

## Données

Toutes les données proviennent de [asondo.ci](https://asondo.ci) (publiques et vérifiables).
**Aucune donnée inventée.** Les coordonnées GPS de sourcing sont approximatives (degré entier).

## Structure

```
app/
├── layout.tsx              # Inter, I18nProvider, Navbar, Footer
├── page.tsx                # Composition des sections
├── globals.css             # Tokens design Asondo
├── components/
│   ├── Navbar.tsx          # Sticky avec toggle FR/EN
│   └── LanguageToggle.tsx  # Switch FR/EN
└── sections/
    ├── HeroBanner.tsx
    ├── EvidenceMatrix.tsx
    ├── SupplyMap.tsx
    ├── ProgrammeDashboard.tsx
    ├── AICopilot.tsx
    ├── RFQForm.tsx
    ├── SamplePackCTA.tsx
    └── Footer.tsx

lib/
├── asondo-data.ts          # Données publiques (FR/EN agnostiques)
├── translations.ts         # Tous les textes FR/EN
├── i18n-context.tsx        # Provider + hook useI18n
├── chat-responses.ts       # Réponses bot bilingues
└── utils.ts                # cn() helper

components/ui/              # shadcn primitives
```

## Design

- **Vert profond** `#1a3a2f` — primaire
- **Or cacao** `#c49a1a` — accent
- **Crème chaud** `#faf9f7` — fond
- **Inter** — police unique (heading + body)

## Déploiement

```powershell
# Vercel Hobby (gratuit)
npx vercel
```
