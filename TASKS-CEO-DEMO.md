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

- [ ] **Homepage — réordonner les sections** : "Échantillon Buyer
  Assurance Pack" (`BuyerPackTeaser`) doit être **avant** "Demandez à
  Asondo" (`AICopilot`). Aujourd'hui c'est l'inverse.
- [ ] **`/programme` — bouton cassé** : "Voir la matrice de preuves
  EUDR" n'a pas de route / ne redirige pas. Doit pointer vers `/eudr`.
- [ ] **Homepage hero — bouton** : "Vérifier notre conformité EUDR" doit
  pointer vers `/eudr` (probablement déjà le cas côté code, à
  vérifier).
- [ ] **`/eudr` — ajouter `BuyerPackTeaser`** : la section téléchargement
  PDF de la home doit aussi exister sur `/eudr`, juste **au-dessus** de
  `OperationalStatus` ("Statut opérationnel — temps réel… Première
  campagne EUDR 2025/26").

---

## 4. Phase finale — audit + correctifs

- [ ] **Données réelles** : balayer toutes les pages publiques pour
  traquer les chiffres inventés, dates incohérentes, faux awards, faux
  partenaires. Toute donnée non vérifiable doit être soit sourcée, soit
  retirée, soit reformulée comme projection claire.
- [ ] **Boutons** : chaque CTA du site doit mener quelque part de
  cohérent. Zéro `href="#"` mort, zéro `<button>` sans action.
- [ ] **i18n FR / EN** : chaque section doit se traduire proprement.
  Pas de chaîne française orpheline sur la version EN (et inverse).
- [ ] **Responsive mobile** : tester les pages clés en viewport étroit
  (~375px). Pas de débord horizontal, pas de texte coupé.

---

## 5. Verdict CEO

- [ ] À la fin : résumé structuré de **tout ce qui a été corrigé** +
  **ce qui reste ouvert** + avis clair : *site présentable au CEO
  en l'état, oui / non et pourquoi*.

---

## Workflow

1. Créer ce fichier ✅ (tu es en train de le lire).
2. Exécuter chaque item section 3 dans l'ordre.
3. Faire l'audit section 4 avec correctifs directs.
4. Commit groupé + push.
5. Donner le verdict final au user.
