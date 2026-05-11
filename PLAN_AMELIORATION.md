# Plan d'amélioration Asondo Buyer Assurance OS

**Date** : 2026-05-11  
**Auteur** : Cascade  
**Objectif** : Corriger les bugs critiques d'affichage et compléter le site
pour une présentation publique CEO-ready niveau acheteur UE/EUDR.

---

## Phase A — Fix bug d'affichage initial (LOADING / FOUC)

**Problème observé** : au chargement de `localhost:3000`, le background du
hero + les 3 cartes (Origin / Mission / Programme) apparaissent **avant**
que le reste du site ne se monte. L'utilisateur voit un état partiel
pendant 1–3 secondes, puis le reste arrive en cascade. C'est typique
d'un flash of unstyled content (FOUC) + lazy hydration des sections en
client.

**Cause racine** :
- Toutes les sections sont des `"use client"` components.
- L'image `/backgroundhero.jpg` (~1.2 MB) charge en priorité, donc le
  hero rend dès qu'elle arrive — mais les autres sections attendent le
  bundle JS et leurs propres calculs framer-motion / dynamic Leaflet.
- Pas d'écran de chargement global.

**Solution choisie** :
1. Splash screen plein écran (`<SiteLoader />`) injecté dès le HTML
   initial via un `<div id="site-loader">` dans `app/layout.tsx`.
2. Script inline dans `<head>` qui ajoute `class="site-loading"` à
   `<html>` immédiatement, avant tout React.
3. CSS dans `globals.css` qui masque `<main>` derrière le loader tant
   que la classe `site-loading` est présente.
4. Composant client `<SiteReadyGate />` qui :
   - Attend `document.readyState === "complete"`
   - Attend `document.fonts.ready`
   - Précharge `/backgroundhero.jpg`, `/asondologocomplet.PNG`, les
     logos partenaires.
   - Attend l'hydratation React (juste un `useEffect` mounted).
   - Ajoute un délai mini 400ms pour éviter le flash si tout est déjà
     en cache.
   - Retire `site-loading` de `<html>` → fade-out CSS du loader.
5. Le loader montre le logo Asondo + un spinner orange + une barre de
   progression discrète.

**Critères de succès** :
- Reload de la page → écran orange/cream uniforme avec spinner pendant
  1–3 secondes maximum.
- Quand le splash disparait, **toute la page** (hero + cards + sections
  suivantes) apparait d'un seul tenant en fade-in 400ms.
- Aucune section ne pop tardivement.

---

## Phase B — Footer : background vert → orange

**Cible** : `app/sections/Footer.tsx`.

**Changements** :
- `bg-gradient-to-br from-[#1F3D2F] via-[#163024] to-[#0F2619]` →
  `bg-gradient-to-br from-[#E8833D] via-[#D06B1F] to-[#A85318]`
  (orange ember saturé, raccord avec la palette hero).
- Texte primaire `text-white` → conservé blanc (contraste OK sur
  orange).
- Texte secondaire `text-white/70` → `text-white/85` (boost légèrement
  pour rester lisible).
- Logo footer `color="white"` → conservé blanc (lisibilité).
- Container partenaires `bg-white/95` → conservé (offre un point
  d'ancrage clair sur fond orange).
- Icônes contact (MapPin, Phone, Mail) : background `bg-white/5
  border-white/10` → `bg-white/15 border-white/25`, hover `bg-[#1F3D2F]`
  (vert cocoa cette fois, pour inversion thermique).
- Couleur des icônes : `text-[#F2B83E]` → `text-white` puis hover
  `text-[#1F3D2F]` (cocoa green).
- Liens rapides hover `hover:text-[#F2B83E]` → `hover:text-[#1F3D2F]`.
- Séparateur top `border-white/10` → `border-white/25`.
- Orb décoratif `bg-[#E8833D]/10` → `bg-[#1F3D2F]/15` (cocoa
  contrastant).
- Tagline gold heading `text-[#F2B83E]` → `text-[#1F3D2F]` ou
  `text-white` selon densité visuelle.

---

## Phase C — 🔴 Items BLOQUANT pour CEO

### C.1 — Mentions légales (FR + EN)

**Fichier** : `app/(site)/legal/mentions-legales/page.tsx`

**Champs requis** (basé sur servicepublic.gouv.ci + obligation site
internet pro France/UE) :
- Raison sociale + forme juridique : ASONDO SA
- Capital social : `<placeholder à compléter>`
- RCCM : `<placeholder à compléter — ex: CI-ABJ-2010-B-XXXX>`
- N° compte contribuable / NIF : `<placeholder>`
- Code Importateur/Exportateur Min. Commerce : `<placeholder>`
- Siège social : Treichville, zone 3, Rue des ferronniers, immeuble
  le blason 3ème étage, Abidjan, Côte d'Ivoire
- Représentant légal (Directeur de publication) : Ludovic M'bahia Blé, PDG
- Téléphone : +225 07 99 85 29 16
- Email : admin@asondo.ci
- Hébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
  USA
- Domaine : asondo.ci

### C.2 — Politique de confidentialité (FR + EN)

**Fichier** : `app/(site)/legal/confidentialite/page.tsx`

**Sections** (RGPD UE 2016/679 + Loi ivoirienne 2013-450) :
1. Responsable de traitement : ASONDO SA
2. Délégué à la Protection des Données (DPO) : `<placeholder>`
3. Données collectées : nom, email, téléphone, société, pays,
   volume RFQ, port de livraison, message, IP de soumission
4. Finalités : qualification commerciale RFQ, génération du Buyer
   Pack, suivi commercial, statistiques anonymisées
5. Base légale : intérêt légitime + consentement
6. Durée de conservation : 3 ans après dernier contact
7. Destinataires : équipe Asondo + sous-traitants techniques (Vercel,
   Google Gemini si activé)
8. Transferts hors UE : Côte d'Ivoire — autorité APDP, hébergement
   Vercel USA sous Standard Contractual Clauses 2021
9. Droits : accès, rectification, effacement, portabilité,
   opposition, limitation, retrait du consentement
10. Cookies : essentiels uniquement (i18n, session console). Pas de
    cookies marketing/analytics par défaut.
11. Réclamation : APDP Côte d'Ivoire (https://apdp.ci/) ou autorité
    de contrôle compétente UE (CNIL France).
12. Contact DPO : dpo@asondo.ci (placeholder)

### C.3 — CGU (Conditions générales d'utilisation)

**Fichier** : `app/(site)/legal/cgu/page.tsx`

**Sections** :
1. Objet — règles d'accès et d'usage du site asondo.ci
2. Acceptation — la consultation vaut acceptation
3. Accès — gratuit, 24/7, sauf maintenance
4. Propriété intellectuelle — marque Asondo, contenus, logos
5. Données personnelles — renvoi à la Politique de confidentialité
6. Responsabilité — site fourni "as-is", informations indicatives,
   les chiffres réels sont contractuels via RFQ et Buyer Pack signé
7. Liens externes — Asondo n'engage pas sa responsabilité
8. Loi applicable — droit ivoirien (OHADA + lois CI)
9. Compétence territoriale — Tribunal de commerce d'Abidjan
10. Modifications — Asondo se réserve le droit de modifier les CGU,
    notification par mise à jour de la date

### C.4 — Compliance Officer EUDR

**Fichier** : `app/(site)/eudr/compliance-officer/page.tsx`

Page dédiée avec :
- Rôle (Article 4 EUDR : opérateur exportateur doit avoir un système
  de diligence raisonnable établi)
- Identité du responsable conformité : `<placeholder>` (CEO peut être
  délégué selon taille de l'entreprise)
- Email dédié : compliance@asondo.ci (placeholder)
- Procédure de remontée d'alerte (whistleblower) : email anonyme
- Engagements : revue annuelle du système DDS, traçabilité aval
  (numéro de référence DDS communiqué à chaque acheteur)

### C.5 — Due Diligence Statement template (Article 4 EUDR)

**Fichier** : `app/(site)/eudr/due-diligence-statement/page.tsx`

**Format** (basé sur Annex II Règlement UE 2023/1115 + ECA Protocol
2025) :
1. Operator information : ASONDO SA, RCCM, adresse, contact
2. Authorized representative : `<CEO>`
3. Reference number (DDS) : auto-généré ASD-DDS-YYYY-NNNN
4. Product description :
   - HS code : 1801 00 00 (cocoa beans, whole or broken, raw or
     roasted)
   - Common name : Cocoa beans (fèves de cacao)
   - Scientific name : Theobroma cacao L.
5. Country of production : Côte d'Ivoire (CI)
6. Quantity : `<volume>` kg / tons
7. Geolocation : polygones GeoJSON anonymisés (1 démo coopérative
   sample, le reste sous NDA)
8. Time of production : `<placeholder>` (campagne 2024/25)
9. Statement of due diligence : conformité EUDR cut-off date
   31/12/2020, légalité production, absence de déforestation
10. Bouton "Télécharger le template DDS Asondo (PDF)" — lien vers
    `/api/dds-template` ou un PDF statique préparé.

### C.6 — Image OG dynamique 1200×630

**Fichiers** : `app/opengraph-image.tsx` + `app/twitter-image.tsx`

Utilise `next/og` (ImageResponse) pour générer dynamiquement une image
1200×630 :
- Fond : gradient orange ember (cohérent avec hero)
- Logo Asondo blanc en grand
- Tagline : "Cacao ivoirien traçable et durable — EUDR-Ready"
- Sous-tagline : "asondo.ci · CCC Licensed Exporter 2025/26"
- Mark cocoa pod gold en décoration

### C.7 — robots.txt

**Fichier** : `app/robots.ts` (Next.js génère automatiquement
`/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /console/
Disallow: /api/
Sitemap: https://asondo.ci/sitemap.xml
```

### C.8 — sitemap.xml

**Fichier** : `app/sitemap.ts` (Next.js génère automatiquement
`/sitemap.xml`)

Inclut : `/`, `/eudr`, `/eudr/compliance-officer`,
`/eudr/due-diligence-statement`, `/programme`, `/reseau`, `/contact`,
`/equipe`, `/legal/mentions-legales`, `/legal/confidentialite`,
`/legal/cgu`. Tous avec `changeFrequency: monthly` + `priority`.

---

## Phase D — 🟠 Items IMPORTANT

### D.1 — Pages séparées (au lieu d'anchors)

**Fichiers** :
- `app/(site)/programme/page.tsx` → reuse `<ProgrammeDashboard />`
- `app/(site)/eudr/page.tsx` → intro + `<EvidenceMatrix />` + liens
  vers Compliance Officer + DDS
- `app/(site)/reseau/page.tsx` → reuse `<SupplyMap />`
- `app/(site)/contact/page.tsx` → reuse `<RFQForm />` + carte HQ

Ajouter ces liens dans le Navbar (en plus des anchors existants pour
la home).

### D.2 — Track-record placeholder honnête

Sur `/eudr` page, ajouter une section "Track-record" sous Evidence
Matrix avec des stats honnêtes et placeholders :
- "X coopératives partenaires (sous NDA)"
- "Y planteurs identifiés dans le système de traçabilité"
- "Z hectares cartographiés en 2024/25"
- "Volume détaillé disponible dans le Buyer Pack — request RFQ"

Pas d'invention, juste de la transparence sur ce qui est public.

### D.3 — Carte polygone démo

**Fichier** : `app/components/InteractiveMap.tsx` + un nouveau composant
`<PolygonLayer />`

**Données** : `lib/geo-sample.ts` avec 1 polygone GeoJSON anonymisé
(forme géométrique réaliste de ~50 ha en zone Centre, sans nom
identifiable). Affichage en surcouche sur la carte avec toggle "Voir
exemple polygone EUDR (anonymisé)".

### D.4 — Page Team / Direction

**Fichier** : `app/(site)/equipe/page.tsx`

Cards pour :
- PDG : Ludovic M'bahia Blé (représentant légal, public via RCCM)
- Compliance Officer EUDR : fonction requise par art. 4 Règlement UE 2023/1115,
  nom communiqué nominativement sous Buyer Pack / NDA

Chaque card : photo placeholder, nom, titre, email, courte bio.

### D.5 — Code de conduite fournisseurs téléchargeable

**Fichier** : `app/(site)/programme/code-fournisseurs/page.tsx` + un
PDF généré ou statique dans `public/code-de-conduite-fournisseurs.pdf`.

Référencé dans : ProgrammeDashboard, Footer, EUDR page.

### D.6 — Newsletter + press contact

**Fichier** : `app/sections/Footer.tsx` (ajout d'une colonne) +
`app/api/newsletter/route.ts`

- Input email + bouton "S'abonner"
- Stockage `data/newsletter.json` (similaire à leads.json)
- Rate limit 3 / heure / IP
- Lien press : `press@asondo.ci` ou `media@asondo.ci`

---

## Phase E — Tests et validation finale

- `pnpm typecheck` doit passer
- `pnpm build` doit passer
- `pnpm lint` doit passer
- Reload manuel : pas de FOUC visible
- Footer orange visuel cohérent
- Toutes les nouvelles routes accessibles
- `/robots.txt` et `/sitemap.xml` accessibles
- OG image visible via `https://asondo.ci/opengraph-image`

---

## Items qui requièrent l'utilisateur (à demander en fin de session)

Données légales désormais vérifiées (source : annonce notariée
Maître Christine E. Nanou-Adou, publiée sur Abidjan.net) :

1. **RCCM Asondo** : CI-ABJ-03-2020-B14-11898 (vérifié)
2. **Capital social** : 300 000 000 FCFA (post-AGE 21/04/2021)
3. **Forme** : SA avec CA-PDG
4. **Dépôt Greffe** : 27809/GTCA/RC/2022, Tribunal de Commerce d'Abidjan,
   13/06/2022

Données qui requièrent encore l'équipe Asondo (non publiées sur sources
publiques consultées) :

1. **N° compte contribuable / NIF**
4. **Code Importateur/Exportateur** Min. Commerce CI
5. **Nom du Compliance Officer** (peut être le CEO ou un nominé)
6. **Email DPO** (`dpo@asondo.ci` recommandé)
7. **Email Compliance Officer** (`compliance@asondo.ci` recommandé)
8. **Email Press** (`press@asondo.ci` recommandé)
9. **Volumes track-record réels** (si non NDA)
10. **Photos de l'équipe direction** (au moins le CEO)
11. **Confirmation hébergeur** (si autre que Vercel)

D'ici là tous les placeholders sont marqués clairement « `<à
compléter>` » dans les fichiers, en italique sur le rendu, pour qu'ils
soient impossibles à oublier.
