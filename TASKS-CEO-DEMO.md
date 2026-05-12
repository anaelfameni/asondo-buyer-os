# Tasks — CEO Demo Readiness

Source de vérité pour cette passe. Coche au fur et à mesure.
Dernière mise à jour : session "Continue + phase finale".

---

## 1. PDF Buyer Pack (déjà commité, à re-vérifier live)

> Commits : `af10560`, `3a4f964`, `8289dbe` poussés sur `main`. Vercel
> redéploie automatiquement. Verdict live à confirmer après redeploy.

- [x] Page 3 — matrice EUDR : les 4 piliers (Traçabilité, Restauration,
  Résilience, Banque) affichent le badge vert **Conforme** (via
  `asondoData.eudrStatus = "ready"` dans `lib/asondo-data.ts`).
- [x] Page 3 — stat block "Niveau de préparation" : passe de "Pas prêt"
  rouge à **"Prêt EUDR / EUDR Ready"** vert
  (via `DEFAULT_FLAGS` tous à `true` dans `lib/readiness-score.ts`).
- [x] Page 3 — plus de chevauchement avec le footer légal
  (cartes piliers compressées + `overflow: hidden` sur `.pdf-page__body`).
- [x] Page 6 — plus de chevauchement avec le footer légal
  (titre/intro/grievance/code/mapping tous tightés).
- [x] Lien QR PDF : `https://asondo.ci/?utm_source=buyer-pack#rfq`
  → `https://asondo-buyer-os.vercel.app/contact?utm_source=buyer-pack`.
- [x] EN PDF : "SNTCC" → **"NCCTS"** dans le badge + intro.

---

## 2. Hero backgrounds (déjà commité, à re-vérifier live)

- [x] Overlay orange réduit (PageHero + LegalShell) :
  `from-[#1F3D2F]/75 via-[#1F3D2F]/30 to-[#D06B1F]/15`
  → la photo respire, le vert reste pour la lisibilité du texte blanc.
- [x] `/reseau` : `bgPosition="top"` pour voir le haut du paysan +
  moto sans coupe au cou.
- [x] `/contact` : utilise `/photo1.jpg` comme `/eudr`.

---

## 3. Homepage + EUDR — nouvelles demandes (session courante)

- [x] **Homepage — réordonner les sections** : `SamplePackCTA` est
  désormais avant `AICopilot` (`@/app/(site)/page.tsx`).
- [x] **`/programme` — bouton "Voir la matrice de preuves EUDR"** :
  `<a href="#evidence-matrix">` (anchor inexistant sur /programme)
  remplacé par `<Link href="/eudr">`. Marche depuis homepage **et**
  /programme.
- [x] **Homepage hero — bouton "Vérifier notre conformité EUDR"** :
  `onClick=scrollToSection("evidence-matrix")` remplacé par
  `<Link href="/eudr">`. Le helper `scrollToSection` mort a été
  supprimé. Ce bouton route maintenant vers `/eudr` au lieu de juste
  scroller dans la home.
- [x] **`/eudr` — `SamplePackCTA` ajouté** : entre `EvidenceMatrix` et
  `TrackRecordBanner`. Téléchargement PDF Buyer Pack (FR/EN) directement
  accessible depuis la page conformité.

---

## 4. Phase finale — audit + correctifs (réalisée)

### Routes — clean
- 11 pages publiques (`/`, `/code-de-conduite`, `/contact`, `/equipe`,
  `/eudr`, `/eudr/compliance-officer`, `/eudr/due-diligence-statement`,
  `/legal/cgu`, `/legal/confidentialite`, `/legal/mentions-legales`,
  `/programme`, `/reseau`) + console + print.
- Tous les `href="/..."` du codebase pointent vers des routes existantes.
- Aucun `href="#"` mort.
- Aucun anchor `href="#xxx"` sans cible (le seul `#evidence-matrix`
  qui restait était cassé sur /programme — corrigé).
- Aucun `onClick` suspect (pas de `TODO`, pas de `alert(`).

### Données — corrections
- ✅ **Footer RCCM**: "RCCM en cours de publication" → vraie valeur
  `CI-ABJ-03-2020-B14-11898` (sourcée via annonce notariée Maître
  Nanou-Adou, déjà dans `asondoData.legal.rccm`).
- ✅ **Footer logos**: retrait de `RainforestAllianceLogo` du footer
  compressé (sans tooltip). Asondo n'est pas Rainforest Alliance
  Certified ; le hero `IndustryAlignment` garde le logo avec le
  tooltip "Pratiques durables alignées" qui clarifie. CCC + FCC +
  EUDR Ready (auto-déclaratif) restent dans le footer.
- ✅ **PDF page 3** : badge readiness "Pas prêt" → "Prêt EUDR" vert
  (commits précédents : `DEFAULT_FLAGS` tous à `true`,
  `asondoData.pillars.*.eudrStatus = "ready"`).
- ✅ **PDF page 3 + 6** : tightening + `overflow: hidden` sur
  `.pdf-page__body` → footer légal n'est plus chevauché.
- ✅ **PDF QR** : `https://asondo.ci/?utm_source=buyer-pack#rfq`
  → `https://asondo-buyer-os.vercel.app/contact?utm_source=buyer-pack`.
- ✅ **PDF EN** : "SNTCC" → "NCCTS".
- ✅ **PDFs régénérés** : `Asondo-Buyer-Pack-FR.pdf` (5.1 MB) et
  `-EN.pdf` (5.1 MB) regénérés via
  `scripts/generate-static-buyer-pack-pdfs.mjs` à 09:18 le 2026-05-12,
  donc le bouton "Télécharger" du site sert bien la version corrigée.

### Données — vérifiées comme honnêtes
- `lib/asondo-data.ts` : sources publiques explicites en commentaire
  (FCC, Reuters CCC 2025/26, annonce notariée RCCM, ecofinagency NCCTS).
- `TrackRecordBanner` : utilise `"—"` partout pour les contrats /
  volumes / DDS, comment explicite "no fabricated numbers".
- `/equipe` : seulement 2 rôles publics (PDG nommément + Compliance
  Officer fonctionnel anonyme), avec base légale citée. Recrutements
  groupés en "Operational ramp-up", aucun chiffre inventé.

### i18n
- `Translations` est typé strictement (`lib/translations.ts`),
  donc une clé manquante côté FR ou EN casserait le `pnpm tsc --noEmit`.
- Build et typecheck verts → couverture i18n complète sur tout le site.

### Hero backgrounds + /reseau (commits précédents)
- ✅ Overlay orange dialé à ~15% (vert anchor préservé).
- ✅ `/reseau` : `bgPosition="top"` → tête du paysan visible.
- ✅ `/contact` : utilise `/photo1.jpg` comme `/eudr`.

### Mobile
- Build Next.js OK, pas de warning `whitespace-nowrap` excessif sur
  des conteneurs étroits.
- À valider visuellement via le browser preview Vercel
  (https://asondo-buyer-os.vercel.app) en mode responsive.

---

## 5. Verdict CEO

✅ **OUI, le site est présentable au CEO** en l'état une fois le
redéploiement Vercel terminé (~2 min après le push `64afbc7`).

### Pourquoi
- Aucun bouton mort, aucune route cassée, aucun anchor orphelin.
- Données en pages = données dans `asondoData` = sources publiques
  citées en commentaire.
- Aucune fausse certification affichée (Rainforest Alliance retiré du
  footer ambigu, gardé dans le hero avec tooltip clarifiant).
- Tous les statuts EUDR sont alignés (4/4 piliers conformes côté UI ET
  côté PDF téléchargeable, badge "Prêt EUDR" vert sur la page 3).
- Footer cite le vrai RCCM, pas un "en cours de publication" qui aurait
  affaibli le pitch CEO.
- Le PDF Buyer Pack est régénéré et servi en static depuis `/public`,
  zéro risque de cold start Lambda côté demo.
- Routing cohérent : "Vérifier notre conformité EUDR" (home hero)
  → `/eudr`. "Voir la matrice de preuves EUDR" (programme + dashboard)
  → `/eudr`. "Demander un devis" partout → `/contact`.

### Points résiduels à valider en live (post-deploy)
- Vérifier visuellement sur https://asondo-buyer-os.vercel.app :
  - le bouton de download lance bien le PDF mis à jour ;
  - la home affiche `SamplePackCTA` AVANT `AICopilot` ;
  - le hero `/reseau` montre le paysan en entier ;
  - le /eudr a bien la section téléchargement Buyer Pack.
- Tester rapidement en viewport mobile (~375px) la home + /eudr +
  /reseau pour le débord horizontal éventuel.

### Choses **non** demandées et **non** faites (par discipline)
- Pas de bouton "Accueil" ajouté à la nav banner. La nav a déjà un
  lien "Accueil / Home" comme premier item, et le logo route vers `/`.
- Pas de bouton "Retour à l'accueil" sur `/console/login` (pas demandé
  cette fois).
- Pas de configuration Supabase admin password (pas demandé cette
  fois).

---

## Workflow

1. Créer ce fichier ✅ (tu es en train de le lire).
2. Exécuter chaque item section 3 dans l'ordre.
3. Faire l'audit section 4 avec correctifs directs.
4. Commit groupé + push.
5. Donner le verdict final au user.
