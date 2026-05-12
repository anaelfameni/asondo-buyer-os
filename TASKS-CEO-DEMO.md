# Asondo Buyer OS — Checklist demo CEO

Source de vérité pour la passe en cours. Aucune autre modification n'est faite tant que ce fichier n'est pas vidé. Format : `[ ]` à faire / `[x]` fait.

Dernier commit pertinent sur `main` au lancement de cette passe : `8289dbe`.

---

## A. PDF Buyer Assurance Pack

### Page 3 — Evidence Matrix
- [x] Faire passer le badge "Niveau de préparation" de rouge "Pas prêt" à vert "Prêt"
  - Réalisé en flippant `DEFAULT_FLAGS` à `true` dans `lib/readiness-score.ts` (commit `3a4f964`). Le PDF affichera "Prêt EUDR / EUDR Ready" en vert.
- [x] Toutes les cartes piliers en vert "Conforme" (Traçabilité, Restauration, Résilience, Banque)
  - Déjà fait : `asondoData.pillars[*].eudrStatus = "ready"` dans `lib/asondo-data.ts`.
- [x] Plus de chevauchement entre le footer légal "ASONDO SA · …" et le bloc Banque
  - Cartes resserrées (`styles.css` `.pdf-pillar`) + spacers réduits dans `EvidenceMatrix.tsx` + `overflow: hidden` sur `.pdf-page__body`. Commit `3a4f964`.

### Page 6 — CSDDD Bridge
- [x] Plus de chevauchement entre le tableau "Cadres réglementaires couverts" et le footer légal
  - Tableau ancré en bas via `marginTop: auto` + body `overflow: hidden`. Code-of-conduct et grievance card resserrés. Commit `3a4f964`.

### Lien QR / RFQ
- [x] Le QR renvoie sur `https://asondo-buyer-os.vercel.app/contact` (et non `https://asondo.ci/?utm_source=buyer-pack#rfq`)
  - Mis à jour dans `app/print/buyer-pack/page.tsx`. Commit `3a4f964`.

---

## B. Hero des pages dédiées

- [x] Réduire l'effet orange à ~10–15 % sur les fonds hero (PageHero + LegalShell)
  - Gradient passé de `from-[#1F3D2F]/85 via-[#D06B1F]/65 to-[#E8833D]/50` à `from-[#1F3D2F]/75 via-[#1F3D2F]/30 to-[#D06B1F]/15`. Orbes dimés. Commit `3a4f964`.
- [x] `/reseau` — repositionner la photo pour voir le haut (tête + épaules du paysan à côté de la moto)
  - `PageHero` accepte maintenant `bgPosition`, `/reseau` passe `bgPosition="top"`. Commit `3a4f964`.

---

## C. Reordonner / réparer la page d'accueil (`/`)

- [x] La section "Échantillon Buyer Assurance Pack" doit passer **avant** la section "Demandez à Asondo"
  - Ordre dans `app/(site)/page.tsx` : Hero → EvidenceMatrix → SupplyMap → ProgrammeDashboard → **SamplePackCTA** → AICopilot → HomeRFQTeaser.
- [x] Le bouton hero "Vérifier notre conformité EUDR" doit pointer vers `/eudr`
  - `HeroBanner.tsx` : le `<button onClick={() => scrollToSection("evidence-matrix")}` est devenu un `<Link href="/eudr">`. Le helper `scrollToSection` (mort) a été supprimé.

---

## D. Page `/programme`

- [x] Le bouton "Voir la matrice de preuves EUDR" doit pointer vers `/eudr` (actuellement cassé / non fonctionnel)
  - `ProgrammeDashboard.tsx` : `<a href="#evidence-matrix">` → `<Link href="/eudr">`. Marche identiquement sur la home et sur `/programme`.

---

## E. Page `/eudr`

- [x] Ajouter la section "Échantillon Buyer Assurance Pack" (avec le même bouton de téléchargement PDF que sur la home)
- [x] Placer cette section **juste au-dessus** de la section "Statut opérationnel — temps réel / Première campagne EUDR 2025/26 …"
  - `app/(site)/eudr/page.tsx` : ordre devenu Hero → EvidenceMatrix → **SamplePackCTA** → TrackRecordBanner → liens deep. Réutilise le même composant `SamplePackCTA` que la home → même bouton, même téléchargement statique.

---

## F. Régénération des PDFs statiques

- [x] `data/settings.json` mis à jour avec tous les `readinessFlags` à `true` (le script de regen utilise ce fichier en l'absence de Supabase locale).
- [x] `pnpm build` + `node scripts/generate-static-buyer-pack-pdfs.mjs` exécutés ; PDF FR + EN réécrits sous `public/`.

---

## Verrou de scope

> IMPORTANT : ne rien changer en dehors des items A–E ci-dessus. Pas de refactor, pas de nettoyage de code adjacent, pas d'amélioration "tant que j'y suis".
