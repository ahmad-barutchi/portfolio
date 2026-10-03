# HANDOVER — Refonte du portfolio `abarutchi.web.app`

> Document de passation pour l'agent qui va **coder** la refonte.
> Rédigé le 2026-10-02 à partir de l'inventaire complet du site actuel (Angular 15, branche `master`).
> Il contient : les décisions de stack, la vision design, le système de design (tokens), les wireframes,
> la spécification composant par composant, **tout le contenu du site actuel** (corrigé), les budgets de
> performance, la structure cible du repo, le déploiement Firebase et un plan de travail par phases.
> L'application Angular existante doit être **supprimée** : tout ce qu'il faut en garder est ici.
> **Mise à jour du contenu (2026-10-03)** : Ahmad vit désormais à **Namur** et travaille depuis **mars 2026** comme **informaticien industriel, chef de projets à l'INASEP** (Namur). Le site en tient compte (`src/data/site.ts` fait foi) ; les mentions de Mons comme base dans ce document et dans la maquette sont dépassées.
> **Statut (2026-10-03)** : le site décrit ici est construit sur la branche `claude/portfolio-redesign-modern-5rzbqf` (voir README.md). Reste à fournir : les captures du TFE (`npm run fetch:images`) et le secret de déploiement Firebase.
> **Maquette de référence** (hero + bento, sombre / clair / mobile, interactive) : https://claude.ai/artifact/Vvs6kQE2NkrDLKixhWypNH
> Elle est privée : Ahmad doit la partager (menu Share) pour qu'un autre compte puisse l'ouvrir.
> Pour le hero et le bento, **la maquette fait foi** en cas d'écart avec ce texte ; son code source
> (fichier `project/Main.dc.html` de l'artifact) contient l'implémentation de référence du champ de points.

---

## 0. TL;DR

| Sujet | Décision |
|---|---|
| Maquette | https://claude.ai/artifact/Vvs6kQE2NkrDLKixhWypNH (privée, à partager par Ahmad) |
| Nom de code du design | **SIGNAL** — encre bleu-nuit, un seul accent ambre « balise », un champ de points vivant en hero, typographie éditoriale XXL. Thème clair « papier & encre » équivalent. |
| Stack | **Astro** (sortie 100 % statique) + **TypeScript** + **CSS vanilla moderne** (custom properties, `oklch`, container queries, scroll-driven animations, view transitions). Aucun framework UI, aucune lib d'animation. |
| JS livré | ≤ 15 KB gzip pour tout le site, ≤ 5 KB sur la page d'accueil. Un seul morceau « riche » : le canvas du hero (~2,5 KB). |
| Requêtes tierces | **Zéro** (polices auto-hébergées, images rapatriées dans le repo, pas de Google Forms, pas d'analytics). |
| Hébergement | Firebase Hosting (plan gratuit, projet `abarutchi`, site par défaut `abarutchi.web.app`), déploiement par GitHub Actions sur `master`. |
| Pages | `/` (one-page à sections), `/projets/robot-secouriste` (étude de cas), `/404`. FR d'abord, EN en phase 2. |
| Cible Lighthouse mobile | ≥ 95 dans les 4 catégories, objectif 100. |
| Branche de travail | `claude/portfolio-redesign-modern-5rzbqf` |

---

## 1. État des lieux (pourquoi on repart de zéro)

### 1.1 Ce qui existe

- Repo : `portfolio/` contient une app **Angular 15 + Angular Material**, build committé dans `portfolio/public/`, déployée sur Firebase (`dist/portfolio/`).
- Routes : `/home`, `/about`, `/activities`, `/activities/tfe`, `/contact`, `/projects` (route morte, non liée dans la nav).
- Nav : 4 boutons flottants à droite (À propos, Activités, Contact, Accueil).
- Fond : dégradé rose/deeppink avec 15 bulles animées en CSS (`.circles`), 5 photos de fond (`bg1..bg5.jpg`) chargées dans le code mais **non utilisées** (logique commentée).
- Contact : un **iframe Google Forms** de 944 px de haut.
- Toutes les captures du TFE sont **hotlinkées depuis imgur** (13 images), les logos depuis Wikipedia / angular.io / smartbear / mongodb.
- Le site est en français avec une page « About » bilingue d'une ligne.

### 1.2 Ce qui pèse

| Ressource | Mesuré sur le build committé |
|---|---|
| `main.js` | 596 KB (142 KB gzip) |
| `polyfills.js` | 34 KB |
| `styles.css` | 114 KB (13 KB gzip) — thème Material complet |
| Polices tierces | Roboto ×3 graisses + Material Icons + Exo (Google Fonts) |
| Images dans le repo | 5,8 MB de JPG (dupliqués dans `src/assets` et `public/assets`), dont `bg2.jpg` 2,8 MB et `bg4.jpg` 1,7 MB, jamais affichés |
| Portrait | `Ahmad Barutchi.jpg` 2048×2048, 433 KB, affiché en 220 px |

À noter : `bg1.jpg`, `bg3.jpg`, `bg5.jpg` portent un copyright **Freepik** dans leurs métadonnées EXIF. Ne pas les réutiliser.

### 1.3 Ce qui ne va pas côté design

- Pas de hiérarchie : tout est centré, en `h1/h3/h4` enchaînés, séparés par des bordures roses de 5 px.
- Spinners Material pour les langues, icônes Material, boutons violets « slateblue » : look « démo de framework ».
- Photo en rond, texte gris, fond rose animé : incohérent et daté.
- Beaucoup de fautes dans la copy (corrigées dans la section 7).
- Aucune méta SEO sérieuse, pas d'OG image, `lang="en"` sur un site français.

**Conclusion** : on ne migre pas, on **reconstruit**. L'app Angular sort du repo (l'historique git la conserve).

---

## 2. Stack et langages — décisions et justification

### 2.1 Choix

| Couche | Choix | Pourquoi |
|---|---|---|
| Générateur | **Astro**, dernière version stable (vérifier `npm view astro version` ; ≥ 5), `output: 'static'` | HTML pur par défaut, **0 KB de JS** sauf ce qu'on ajoute explicitement. Content collections typées (zod), optimisation d'images intégrée (sharp → AVIF/WebP + `srcset`), i18n routing natif pour la phase EN, view transitions. |
| Langage | **TypeScript strict** pour les scripts et la config, **HTML/CSS** dans les composants `.astro` | Pas de runtime, typage du contenu. |
| Styles | **CSS vanilla** en `@layer`, custom properties, `oklch()` + `color-mix()`, container queries, `:has()`, `animation-timeline: view()`, `@view-transition` | Garde le CSS < 20 KB, design sur mesure (un utilitaire comme Tailwind pousse vers un look générique et ajoute une toolchain). |
| Interactivité | `<script>` Astro vanilla (bundlés, `type="module"`, différés) | Les seuls besoins JS : champ de points du hero, thème, nav active, halo curseur/magnétisme, copie d'e-mail, heure locale, zoom d'image via `<dialog>`. |
| Polices | Auto-hébergées via Fontsource : **Geist Variable** (`@fontsource-variable/geist`), **Instrument Serif** italique (`@fontsource/instrument-serif`), **Geist Mono** poids 500 (`@fontsource/geist-mono`), pile de secours `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | Trois fichiers woff2, sous-ensemble latin uniquement, `font-display: swap` + `size-adjust` sur les fallbacks pour zéro CLS. |
| Images | `astro:assets` (`<Image>` / `<Picture>`), sources dans `src/assets/` | AVIF + WebP, dimensions explicites, lazy sauf LCP. |
| Qualité | `astro check`, Prettier + `prettier-plugin-astro`, Playwright (Chromium préinstallé dans ces sessions : `/opt/pw-browsers/chromium`), Lighthouse | Voir section 8 pour les seuils. |
| Hébergement | Firebase Hosting (Spark/gratuit), `firebase.json` à la racine | Déjà en place, domaine `abarutchi.web.app` conservé. |
| CI/CD | GitHub Actions : build + deploy sur push `master`, preview channel sur PR | Action officielle `FirebaseExtended/action-hosting-deploy`. |
| Gestionnaire de paquets | `npm` (lockfile committé) | Simplicité, pas de dépendance à pnpm côté Ahmad. |

### 2.2 Écartés, et pourquoi

- **Angular** (actuel) : 600 KB de JS pour un site statique, Material impose son look.
- **Next.js / Nuxt** : runtime React/Vue inutile pour zéro état applicatif.
- **SvelteKit** : excellent mais Astro gagne sur le « zéro JS » et l'outillage contenu/images.
- **Tailwind, UI kits, icon fonts** : surpoids et uniformité.
- **GSAP, Framer Motion, Lenis, Three.js** : le CSS 2026 couvre 95 % des besoins (scroll-driven, view transitions, `@starting-style`). Le canvas du hero se fait à la main en ~80 lignes.

### 2.3 Ce qu'on ne fait PAS (anti-patterns interdits)

Preloader / écran de chargement · scroll-jacking ou smooth-scroll JS · curseur custom · carrousel · marquee infini · barres de progression de compétences · vidéo autoplay · bannière cookies (il n'y a aucun cookie) · analytics tiers · `filter: blur()` sur de grandes surfaces animées (coûteux sur mobile ; utiliser des dégradés radiaux déjà « doux » à la place) · images hotlinkées.

---

## 3. Vision design « SIGNAL » — la promenade

### 3.1 Le concept en trois lignes

Ahmad est diplômé en **Réseaux & Télécommunications**, son TFE est un **robot secouriste** qui remonte de la télémétrie, et il a été **secouriste** au Croissant-Rouge. Le site s'appuie sur ça : un **champ de signal** (une grille de points qui réagit, un balayage radar), une **balise ambre** comme seule couleur d'accent, une typographie de **magazine** pour raconter un parcours qui va d'Alep à Mons en passant par une école d'art à Gand. Sobre, chaud, vivant. Pas de néon violet, pas de glassmorphism partout.

Références d'ambiance (pas à copier) : la rigueur typographique de linear.app, le soin des micro-interactions de rauno.me, le système Geist de Vercel.

### 3.2 Walkthrough — ce que voit le visiteur

**0 s — Arrivée.** Fond d'encre bleu-nuit (pas un noir plat). Aucun spinner : le HTML est déjà là. En ~1 s, les deux lignes `Ahmad` / `Barutchi.` (casse normale, la seconde décalée de 0,62 em) se lèvent chacune depuis un masque, avec 100 ms de décalage, en Geist 600, interlettrage −0,055 em, taille `clamp(64px, 14cqi, 224px)`. Le point final est **ambre** et pulse doucement : c'est la balise. À droite de « Ahmad », un bloc de télémétrie mono façon HUD :
`STATUT ● Ouvert aux opportunités` / `HEURE 01:27 CEST · Mons` / `COORD. 50.45° N · 3.95° E` — le point pulse, l'heure est locale (Europe/Brussels, rafraîchie toutes les 15 s).
Sous un filet de 1 px (un « paquet » ambre le parcourt toutes les 5,5 s), une phrase de position avec un seul mot en **Instrument Serif italique** :
« **Développeur *full-stack* basé à Mons.** Python, Odoo et Angular, du capteur jusqu'au tableau de bord. »
Deux boutons à droite : « Voir les projets ↘ » (plein ambre, texte encre) et « ↓ CV · PDF » (fantôme). Quatre croix de repère fines marquent les coins de la zone de contenu ; « Défiler » + un trait animé en bas au centre.

**Derrière le nom — le champ de signal.** Une grille de points fins (espacement 28 px, rayon 1 px, contraste très bas) occupe tout le hero. Toutes les ~6 s, une onde circulaire part d'un point aléatoire et traverse le champ : les points qu'elle touche grossissent et s'allument en ambre pendant une fraction de seconde, puis s'éteignent. Quand le visiteur bouge la souris, les points dans un rayon de ~190 px **s'écartent légèrement** du curseur (≤ 10 px, effet de loupe), grossissent jusqu'à ~2,8 px et s'allument en ambre selon la proximité, avec un retard élastique (interpolation 0,12 par frame) : le champ a une masse. L'onde laisse une traînée qui s'éteint en ~1 s et un anneau ambre très pâle marque son front. Sur tactile, pas de curseur : l'onde continue et le champ « respire » (alpha sinusoïdal très lent). Avec `prefers-reduced-motion`, le champ est statique.

**5 s — Premier scroll.** Une barre de progression ambre de 2 px apparaît en haut. La **nav flottante** (une pilule de verre, 44 px de haut, en haut à droite sur desktop) glisse en place ; son indicateur de section actif est une petite capsule claire qui **glisse** d'un item à l'autre (pas un simple changement de couleur). Chaque section s'ouvre par une étiquette mono `01 — À propos` et un titre XXL dont un mot est en serif italique. Les blocs apparaissent par une **remontée de 24 px + fondu**, pilotée par le scroll en CSS pur (`animation-timeline: view()`), donc sans JS et sans saccade.

**01 — À propos.** Deux colonnes. À gauche, le **portrait** en bichromie encre/ambre (`mix-blend-mode` + `filter: grayscale`), 3:4, coins 20 px, qui **reprend ses vraies couleurs au survol** et s'incline légèrement en 3D vers le curseur (≤ 4°). À droite, trois courts paragraphes qui racontent le parcours (copy en section 7.2), puis une **bande de faits** en mono : `FR C2 · EN C1 · AR C2` · `Permis B` · `Mons, BE`.

**02 — Parcours.** Une ligne de temps verticale : un rail à gauche avec les années en mono, une ligne de 1 px qui **se dessine** à mesure que l'on scrolle (scroll-driven), des cartes à droite. L'entrée BHC est mise en avant (bordure ambre, chips de techno). Dessous, les **Formations** en grille compacte de 5 cartes.

**03 — Projets.** Une grille **bento** de 4 colonnes : la tuile « Robot secouriste » occupe 2×2, avec la capture du dashboard dans un cadre d'application **inclinée en 3D** (`rotateX(16deg) rotateY(-12deg) rotateZ(2.5deg)`, débordant en bas à droite) qui se redresse au survol ; un **halo ambre suit le curseur** le long de la bordure de **toutes** les tuiles à la fois (gradient radial positionné par deux variables CSS par tuile). Tuiles 1×1 : DeepVision (glyphe d'iris), Single Digital Gateway (anneau de 12 points façon UE). Tuile 2×1 « **Mons.** » : un **radar** dont le balayage allume tour à tour Bruxelles, Charleroi, Namur, Liège et Gand, les lieux où Ahmad a travaillé, étudié ou participé à des hackathons, plus les langues. Tuile 3×1 : **journal des hackathons**, 7 lignes `date · événement · lieu · ↗`. Tuile 1×1 : ce portfolio (monogramme `ab.`).
Clic sur la tuile du robot → **transition de vue** : la capture s'agrandit et devient l'image d'en-tête de l'étude de cas, sans rechargement perceptible (`view-transition-name`, cross-document, 0 JS).

**04 — Compétences.** Pas de barres, pas de pourcentages. Une **carte de stack** : quatre groupes (Langages, Frameworks, Outils, Concepts) de chips mono. Au survol d'une chip, les chips **liées** s'allument (Odoo → Python, PostgreSQL, JavaScript) et les autres s'estompent : une dizaine de lignes de JS, données dans le JSON.

**05 — Contact.** Pleine largeur. « Travaillons *ensemble*. » en XXL. L'adresse e-mail en très grand, cliquable : un clic **copie** l'adresse et affiche un toast « Copié ✓ » 1,5 s ; le lien `mailto:` reste en secours. Trois liens en dessous : LinkedIn, GitHub, Apprentus, et le téléphone en `tel:`.

**Pied de page.** Mono, minuscule : `© 2026 Ahmad Barutchi · Conçu et codé à Mons · 14:32 à Mons` et un « ↑ Haut de page ». Clin d'œil : un « ♪ » qui, au survol, dit « Je donne aussi des cours de musique ».

**Thème clair.** Même structure, « papier & encre » : fond papier chaud, encre bleu-nuit, points du champ en graphite, accent ambre plus profond pour tenir le contraste. Choisi automatiquement (`prefers-color-scheme`), basculable dans la nav, mémorisé en `localStorage`, appliqué **avant le premier rendu** par un script inline de 5 lignes dans `<head>` (pas de flash).

---

## 4. Système de design (tokens)

Source de vérité en `oklch` ; les hex sont des approximations pour les maquettes.

### 4.1 Couleurs

| Token | Sombre (défaut) | Clair | Usage |
|---|---|---|---|
| `--bg` | `oklch(14% 0.015 260)` ≈ `#0B0D14` | `oklch(97% 0.008 80)` ≈ `#F7F4EE` | fond de page |
| `--bg-2` | `oklch(18% 0.015 260)` ≈ `#13161F` | `#FFFFFF` | surfaces, cartes |
| `--bg-3` | `oklch(22% 0.015 260)` ≈ `#1B1F2A` | `oklch(94% 0.008 80)` ≈ `#EDE9E1` | surfaces survolées, chips |
| `--fg` | `oklch(95% 0.01 80)` ≈ `#F3EFE6` | `oklch(18% 0.015 260)` ≈ `#14161E` | texte principal |
| `--fg-2` | `oklch(76% 0.012 260)` ≈ `#AEB2C0` | `oklch(44% 0.012 260)` ≈ `#585C6A` | texte secondaire |
| `--fg-3` | `oklch(64% 0.012 260)` ≈ `#8B90A0` | `oklch(50% 0.012 260)` ≈ `#666B78` | étiquettes mono (≥ 4,5:1 sur `--bg`) |
| `--accent` | `oklch(82% 0.16 75)` ≈ `#FFB454` | `oklch(70% 0.17 60)` ≈ `#E0781A` | balise : boutons, halo, onde |
| `--accent-text` | = `--accent` | `#A14E00` (≈ 5:1) | accent **en texte petit** sur fond clair (≥ 4,5:1) |
| `--accent-soft` | `color-mix(in oklch, var(--accent) 14%, transparent)` | idem | fonds de chips actives |
| `--line` | `color-mix(in oklch, var(--fg) 10%, transparent)` | `… 12%` | bordures 1 px |
| `--glow` | `color-mix(in oklch, var(--accent) 35%, transparent)` | `… 25%` | halo curseur |

Contrastes vérifiés : `--fg`/`--bg` ≈ 17:1 (sombre) et 15:1 (clair) ; `--fg-2` ≥ 5:1 ; `--fg-3` ≥ 4,5:1 (il ne sert plus aux points du champ) ; `--accent` sur `--bg` sombre ≈ 11:1. Sur fond clair, `#E0781A` ne vaut que ~3,2:1 : **réservé aux grands textes et aux surfaces**, le texte petit utilise `--accent-text`.

Signal field : les points ont leur propre gris, pas `--fg-3` : sombre `rgb(150 157 178)` à alpha 0,32, clair `rgb(92 97 114)` à alpha 0,30 ; allumés = `--accent` à alpha proportionnelle.

Variantes d'accent testables dans la maquette (réglage « accent ») : **corail** `#FF8A6B` / clair `#E5532F`, texte `#B33A1B` ; **menthe** `#5EE6B0` / clair `#12A374`, texte `#0B7553`. L'ambre reste le choix par défaut.

### 4.2 Typographie

| Rôle | Police | Taille (fluide) | Graisse / détails |
|---|---|---|---|
| Display (nom du hero) | Geist | `clamp(64px, 14cqi, 224px)`, `21cqi` sous 620 px | 600, `letter-spacing: -0.055em`, `line-height: 0.86` |
| H2 (titres de section) | Geist | `clamp(40px, 5.6cqi, 84px)` | 600, `-0.05em`, `0.98`, `text-wrap: balance` |
| H3 | Geist | `clamp(1.25rem, 1rem + 1vw, 1.75rem)` | 500, `-0.01em`, `1.2` |
| Accent éditorial (1 mot par titre) | Instrument Serif italique | hérite | 400, `font-style: italic`, légèrement plus grand (`1.06em`) |
| Corps | Geist | `clamp(1rem, 0.95rem + 0.3vw, 1.125rem)` | 400, `line-height: 1.6`, mesure `max-width: 68ch` |
| Étiquettes / télémétrie | Geist Mono | `0.75rem`–`0.8125rem` | 500, majuscules, `letter-spacing: 0.08em`, `font-variant-numeric: tabular-nums` |

Fallbacks avec métriques ajustées (`size-adjust`, `ascent-override`) : Geist → `Arial`/`Helvetica` ; Instrument Serif → `Georgia` ; Geist Mono → `ui-monospace`. Précharger Geist et Geist Mono (Instrument Serif peut rester sans preload) en `<link rel="preload" as="font" crossorigin>`.

### 4.3 Espacement, grille, formes

- Base 4 px. Échelle : 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Conteneur : `max-width: 72rem` (1152 px), gouttières `24px` mobile / `48px` ≥ 900 px.
- Grille 12 colonnes (`grid-template-columns: repeat(12, 1fr)`, `gap: 24px`), bento 4 colonnes sur desktop, 2 sur tablette, 1 sur mobile.
- Padding vertical de section : `clamp(5rem, 12vw, 10rem)`.
- Rayons : `4px` (chips), `12px` (boutons, cartes petites), `20px` (cartes, portrait), `999px` (pilule nav, badges).
- Bordures plutôt qu'ombres sur le sombre : `1px solid var(--line)` + reflet `inset 0 1px 0 color-mix(in oklch, var(--fg) 6%, transparent)`. Sur le clair, une ombre douce unique : `0 1px 2px rgb(0 0 0 / .04), 0 8px 24px rgb(0 0 0 / .06)`.
- Verre : uniquement la nav (`backdrop-filter: blur(12px) saturate(140%)`, fond `color-mix(in oklch, var(--bg) 70%, transparent)`).

### 4.4 Mouvement

- Courbes : `--ease-out: cubic-bezier(.22, 1, .36, 1)` (par défaut), `--ease-in-out: cubic-bezier(.65, 0, .35, 1)`.
- Durées : `160ms` (hover), `240ms` (toggle, toast), `400ms` (révélations), `700ms` (entrée hero).
- Révélation au scroll : `@keyframes rise { from { opacity: 0; translate: 0 24px } }`, `animation-timeline: view()`, `animation-range: entry 0% entry 35%`, dans un `@supports (animation-timeline: view())`. Sans support : le contenu est simplement visible (pas de JS de secours nécessaire).
- Entrée hero : `clip-path: inset(0 0 100% 0)` → `inset(0)` + `translate: 0 20%` → `0`, décalage `calc(var(--i) * 80ms)`.
- Tout est enveloppé par `@media (prefers-reduced-motion: reduce)` : durées à 0, canvas statique, pas de parallaxe.
- Transitions entre pages : `@view-transition { navigation: auto; }` + `view-transition-name` sur l'image projet et sur le titre ; durée 350 ms.

### 4.5 Iconographie et marque

- Icônes : SVG inline, trait 1,5 px, 20 px, `currentColor` (flèche ↗, copier, soleil/lune, GitHub, LinkedIn, mail, téléphone, ♪). Jeu Lucide ou dessinées à la main, inlinées à la demande (chacune ≈ 300 octets). Pas d'icon font.
- Favicon SVG : carré arrondi (rayon 8/32) couleur `--bg`, point ambre r = 5 au centre, arc de 270° r = 10 trait 1,5 ambre à 60 % (une balise). Variante claire via `@media (prefers-color-scheme)` dans le SVG. Ajouter `apple-touch-icon.png` 180 px.
- OG image 1200×630 : fond encre, champ de points statique, `Ahmad Barutchi.` en Geist 600 ~120 px avec le point en ambre, sous-titre « Développeur full-stack · Mons », point ambre. À générer **une fois** avec Playwright (capture d'une page `/og` non liée, ou d'un fichier HTML dans `scripts/`), committer `public/og.png`.

---

## 5. Architecture de l'information et wireframes

### 5.1 Plan du site

```
/                               page unique, sections ancrées
  #accueil   00  Hero + Signal field
  #a-propos  01  À propos (portrait, récit, faits)
  #parcours  02  Expériences (timeline) + Formations (grille)
  #projets   03  Bento projets + journal hackathons
  #competences 04 Carte de stack
  #contact   05  Contact + footer
/projets/robot-secouriste       étude de cas (TFE 2022)
/404                            page d'erreur avec le champ de points
/og  (optionnel, non indexé)    gabarit pour générer og.png
```

Phase 2 : `/en/…` miroir anglais via l'i18n d'Astro, `/cv` page CV imprimable (`@media print`).

### 5.2 Hero — desktop (≥ 1024 px)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ab·                                   (Accueil À propos Parcours Projets Contact | ☾ | CV ↗) │
│                                                                      │
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·  │
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·  │
│ + · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · +  │
│ · · Ahmad · · · · · · · · · · · · · · ·  STATUT ● Ouvert aux opport. │
│ · · · · · · · · · · · · · · · · · · · ·  HEURE  01:27 CEST · Mons    │
│ · · · · · Barutchi● · · · · · · · · · ·  COORD. 50.45° N · 3.95° E  │
│ ──────────────────────────────────────────────────────────────────  │
│ Développeur full-stack basé à Mons.      [ Voir les projets ↘ ] [CV]│
│ · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·  │
│                                                   ↓ défiler · · · ·  │
└──────────────────────────────────────────────────────────────────────┘
```

Le nom est aligné à gauche, la 2e ligne décalée ; la télémétrie s'aligne sur la 1re ligne. Hauteur `100svh` (880 px dans la maquette). Le champ de points est un `<canvas>` absolu en arrière-plan, `aria-hidden`.

### 5.3 Hero — mobile (< 640 px)

```
┌──────────────────────┐
│ ab·              ☰   │
│ · · · · · · · · · ·  │
│ STATUT ● Ouvert …    │   (télémétrie au-dessus du nom)
│ Ahmad                │
│  Barutchi●           │   (nom à 21cqi ≈ 82 px : tient
│ ──────────────────── │    sur deux lignes sans césure)
│ Développeur          │
│ full-stack.          │
│ Python, Odoo,        │
│ Angular.             │
│ [Voir projets][ CV ] │
│                      │
└──────────────────────┘
```

Le menu ☰ ouvre un **overlay plein écran** : 5 liens en Geist 600 à 2,5 rem qui montent en cascade, le toggle thème et le lien CV en bas, fermeture par ✕ ou Échap, focus piégé dans l'overlay.

### 5.4 Parcours (timeline)

```
02 — Parcours
Expériences qui comptent.

2024 │●  Software Engineer · BHC sprl · Mons               [featured]
     │   Développeur Odoo (Python, JavaScript)              Sept 2023 – Oct 2024
     │   [Odoo] [Python] [JavaScript] [PostgreSQL]
2022 │○  Stage · CETIC asbl · Charleroi (hybride)           Fév – mai 2022
     │   Application web de monitoring · Angular
2021 │○  Stage · ACEA · Bruxelles (à distance)              Fév – mai 2021
     │   Application web service · WinDev, Python
2019 │○  La Cédraie · Mons                                  Juin – déc 2019
2016 │○  Apprentus · Belgique                               Depuis août 2016
2013 │○  Bénévole · Croissant-Rouge · Alep                  2013 – 2015
     ▼  (la ligne se dessine au scroll)

Formations
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 2017–2022    │ │ 2016–2017    │ │ 2016         │ │ 2015         │ │ 2013–2015    │
│ HEH, Mons    │ │ Promotion    │ │ KASK, Gand   │ │ AIC4T, Alep  │ │ Univ. d'Alep │
│ Bachelier …  │ │ sociale …    │ │ Open Design… │ │ Formateur …  │ │ Ingénierie … │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 5.5 Projets (bento)

```
03 — Projets
Des choses que j'ai construites.

┌───────────────────────────────┐ ┌──────────────┐ ┌──────────────┐
│ TFE 2022 · BINÔME · IOT [ÉTUDE]│ │ (iris)    ↗  │ │ (anneau)  ↗  │
│ Robot secouriste              │ │ HACKATHON    │ │ HACKATHON    │
│ texte · chips · liens         │ │ DeepVision   │ │ Single Digit.│
│                               │ └──────────────┘ └──────────────┘
│   ╱ capture inclinée 3D ╱     │ ┌───────────────────────────────┐
│  ╱ (déborde du cadre)  ╱      │ │ BASE · BELGIQUE     ( radar ) │
└───────────────────────────────┘ │ Mons.  FR·C2 EN·C1 AR·C2       │
                                  └───────────────────────────────┘
┌───────────────────────────────────────────────────┐ ┌──────────────┐
│ JOURNAL DES HACKATHONS              7 PARTICIPATIONS │ │ ab.       ↗  │
│ FÉV 2023  CSLabs · Le Handicap        UNAMUR    ↗ │ │ CE SITE · V2 │
│ … 7 lignes                                        │ │ Portfolio    │
└───────────────────────────────────────────────────┘ └──────────────┘
```

### 5.6 Étude de cas `/projets/robot-secouriste`

```
← Projets                                              ☾  CV ↗
TFE 2022 · BINÔME · 3 MIN DE LECTURE
Prototypage d'un robot secouriste.
[image d'en-tête = capture du graphe, vient de la tuile par view transition]

┌─────────────────────────────────────────┬──────────────┐
│ Contexte                                │ Sommaire     │
│ Stack (chips)                           │ · Contexte   │
│ Fonctionnement — logiciel               │ · Stack      │
│   Ngx-admin · Utilisateurs · Visualisation │ · Logiciel │
│   JWT · Swagger · Application mobile    │ · Matériel   │
│ Fonctionnement — matériel               │ · Équipe     │
│ Équipe et méthode                       │ (sticky,     │
│                                         │  ≥ 1100 px)  │
└─────────────────────────────────────────┴──────────────┘
Projet suivant →  DeepVision
```

Figures en `<figure>` avec légende mono ; clic → `<dialog>` plein écran avec l'image en `object-fit: contain`, fermeture Échap / clic dehors.

---

## 6. Spécification composant par composant

### 6.1 `Base.astro` (layout)

- `<html lang="fr" data-theme="…">`, `<meta name="color-scheme" content="dark light">`, `theme-color` pour les deux thèmes.
- Script inline **avant** les styles : lit `localStorage.theme`, sinon `matchMedia('(prefers-color-scheme: dark)')`, pose `data-theme`. 5 lignes, pas de flash.
- Skip link « Aller au contenu », `<main id="contenu">`, landmarks `header / nav / main / footer`.
- Préchargement des deux polices, `<link rel="canonical">`, OG/Twitter, JSON-LD `Person` (nom, poste, lieu, `sameAs` LinkedIn + GitHub).
- Barre de progression : `position: fixed; top: 0; height: 2px; background: var(--accent); scale: var(--p) 1; transform-origin: left`, pilotée par `animation-timeline: scroll(root)` (0 JS).

### 6.2 `Nav.astro`

- Desktop : pilule fixe `top: 16px; right: 24px`, items texte 13 px, séparateur, toggle thème (icône soleil/lune avec rotation 180° à la bascule), lien « CV ↗ ».
- Indicateur actif : une capsule `--bg-3` positionnée en absolu, animée en `translate/width` (200 ms) vers l'item actif. Actif = section la plus visible, via `IntersectionObserver` (`threshold` 0.4), ~15 lignes.
- Masquée au scroll vers le bas, réaffichée au scroll vers le haut (translateY −120 %), 10 lignes.
- Mobile (< 900 px) : barre compacte `ab·` + ☰ ; overlay décrit en 5.3.

### 6.3 `Hero.astro` + `scripts/signal-field.ts`

Spécification du champ de points (≤ 2,5 KB minifié, ≤ 100 lignes) :

- `<canvas>` absolu, dimensionné au hero, `devicePixelRatio` respecté (max 2), redimensionnement par `ResizeObserver` (débounce 150 ms).
- Grille : pas 28 px (24 px sous 640 px), chaque point = `{x, y, ox, oy, r, a}` (position courante, origine, rayon, allumage 0..1). Plafond ≈ 3 000 points (1920×1080 / 28² ≈ 2 600).
- Boucle `requestAnimationFrame` active **seulement** si le hero est dans le viewport (IntersectionObserver) **et** l'onglet visible (`visibilitychange`).
- Pointeur (`pointermove` sur le hero, ignoré si `pointerType === 'touch'`) : avec `dx = ox − px`, `d` la distance et `k = 1 − d/190` pour `d < 190` : cible `ox + (dx/d) · 10 · k²` (**effet de loupe : les points s'écartent**), `r` cible `1 + 1.8 · k`, `a` cible `k^1.4`. Interpolation `v += (cible − v) · 0.12` (0,14 pour `r`) chaque frame ; hors rayon, cible = origine, `a → 0`. Convertir les coordonnées avec le ratio `getBoundingClientRect().width / offsetWidth` si un parent est mis à l'échelle.
- Onde : toutes les 5,2–7,6 s, origine aléatoire dans les 70 % centraux ; rayon `R(t) = 0.55 · t` px (t en ms) jusqu'à `0,95 × diagonale`, amplitude `1 − R / (0,95 × diagonale)` ; les points avec `|dist − R| < 30` prennent `w = max(w, (1 − |dist − R|/30) · amplitude)` dans un tableau séparé, qui décroît de ×0,955 par frame (traînée) ; un anneau `--accent` à alpha `0.14 × amplitude` dessine le front.
- Rendu : passe 1, points éteints en gris dédié (voir 4.1) avec alpha `base × respiration × (1 − allumage)`, `fillRect` de `1.5 · r` px ; passe 2, points allumés (`allumage = max(a, w) ≥ 0.03`) en `--accent` avec `arc` de rayon `0.95 · r`. Les couleurs sont recalculées au changement de thème ou d'accent, jamais par frame. Pas de `shadowBlur`.
- Respiration permanente (souris ou tactile) : `0.72 + 0.28 · sin(t/1700 + x/230 + y/310)` sur l'alpha des points éteints. Masque CSS sur le canvas : `linear-gradient(to bottom, #000 55%, transparent 98%)` pour fondre le bas du hero.
- `prefers-reduced-motion: reduce` → un seul rendu statique, aucune boucle.
- Nettoyage : l'onde et le pointeur n'allouent rien par frame (tableaux typés `Float32Array` pour x, y, r, a).

En plus du canvas, un **halo d'ambiance CSS** : deux `radial-gradient` très larges (ambre 7 %, bleu 10 %) sur un pseudo-élément, animés en `translate` sur 40 s, sans `filter: blur`.

Hero : nom en `<h1>` sur deux `<span>` masqués, ligne de télémétrie (`<p class="mono">` avec `<time>` mise à jour chaque minute : 6 lignes JS), phrase de position, deux CTA. Le CTA primaire est **magnétique** : sur `pointermove` dans un rayon de 60 px, le bouton se déplace vers le curseur de 25 % de l'écart (`translate`, 160 ms), revient à zéro en `pointerleave` ; 12 lignes, partagé avec les icônes sociales du contact.

### 6.4 `Section.astro`

Props `index` (`01`), `id`, `label`, `title` (avec un `<em>` pour le mot en serif). Rend `<section id aria-labelledby>` + en-tête `label` mono + `<h2>`. Applique la classe de révélation aux enfants directs.

### 6.5 `About.astro`

- Grille 5/7 colonnes. Portrait `<Image>` depuis `src/assets/portrait.jpg` (recadrer le fichier actuel en **3:4** centré sur le visage), largeurs 480/720/960, AVIF+WebP, `loading="lazy"`.
- Bichromie : `filter: grayscale(1) contrast(1.05)` + calque `mix-blend-mode: multiply` ambre à 35 % (sombre : `screen`), transition 400 ms vers `filter: none` et calque à 0 au survol/focus.
- Inclinaison : `perspective: 900px; rotateX/rotateY` ≤ 4° depuis la position du pointeur (12 lignes, désactivé en reduced-motion et en tactile).
- Récit : trois `<p>` (section 7.2). Bande de faits : `<dl>` en ligne, mono.

### 6.6 `Timeline.astro` + `EducationGrid.astro`

- `<ol>` sémantique. Rail : `::before` 1 px `--line` + un second calque `--accent` dont `scale: 1 var(--drawn)` est piloté par `animation-timeline: view()` sur toute la hauteur de la liste.
- Entrée : année en mono dans la colonne gauche (sticky sur desktop le temps de son item), carte à droite : titre (`h3`), organisation + lieu (`--fg-2`), période mono alignée à droite, description, chips. `data-featured` → bordure ambre + reflet.
- Formations : `<ul>` grille `repeat(auto-fit, minmax(200px, 1fr))`, cartes : période mono, école, intitulé, lien éventuel.

### 6.7 `ProjectGrid.astro` + `ProjectCard.astro` + `HackathonLog.astro`

- Bento `grid-template-columns: repeat(4, minmax(0, 1fr))`, `grid-auto-rows: minmax(248px, auto)`, `gap: 16px`. Ordre DOM : vedette (2×2), DeepVision, SDG, radar (2×1), journal (3×1), portfolio (1×1). Sous 980 px de conteneur : 2 colonnes, journal et portfolio en pleine largeur. Sous 620 px : 2 colonnes, vedette en hauteur auto, radar sous son texte. Utiliser des **container queries** sur un conteneur `container-type: inline-size` et les unités `cqi` pour la typo.
- Carte : `position: relative; overflow: hidden; border: 1px solid var(--line)`. Halo : `::before` `radial-gradient(240px circle at var(--mx) var(--my), var(--glow), transparent 60%)` sur la **bordure** (pseudo-élément masqué par `mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000); mask-composite: exclude; padding: 1px`) → le halo n'éclaire que le contour. `--mx/--my` posés par un listener `pointermove` délégué sur la grille (8 lignes).
- Tuile vedette : capture dans un cadre d'application `--bg-3` (barre à 3 pastilles, rail latéral), largeur 118 %, débordant en bas à droite, `transform: perspective(1500px) rotateX(16deg) rotateY(-12deg) rotateZ(2.5deg)` avec `transform-origin: 0 0` → `perspective(1500px) rotateX(4deg) rotateY(-3deg) translateY(-14px)` au survol (900 ms, `--ease-out`).
- Tuile radar : cercle de 200 px, anneaux `repeating-radial-gradient`, balayage `conic-gradient` qui tourne en 4 s ; chaque ville est un point dont l'animation (4 s, même période) a un `animation-delay` égal à `angle / 360 × 4 s`, si bien qu'elle s'allume quand le balayage passe. Échelle ≈ 0,75 px/km depuis Mons : BXL (+21, −33), CRL (+26, +3), NAM (+49, −2), LGE (+86, −15), GND (−12, −50). `view-transition-name: projet-robot` sur l'image et `projet-robot-titre` sur le titre ; mêmes noms dans l'en-tête de l'étude de cas.
- Tuiles externes : titre, étiquette mono (`HACKATHON · 2023`), flèche ↗ qui se déplace en diagonale de 2 px au survol, `rel="noopener"`.
- Journal : `<table>` ou `<ol>` mono, 7 lignes, lien GitHub quand il existe.

### 6.8 `SkillMap.astro`

- Quatre `<ul>` (Langages, Frameworks, Outils, Concepts) de chips `--bg-3`, mono 13 px.
- `data-skill="odoo" data-links="python postgresql javascript"`. Au `pointerenter`/`focus` d'une chip : la grille reçoit `data-active`, les chips liées `data-lit`, les autres passent à `opacity: .35` (160 ms). Réinitialisé au `pointerleave`. ≈ 15 lignes.

### 6.9 `Contact.astro` + `Footer.astro`

- Titre XXL, e-mail en `<button>` (copie via `navigator.clipboard`, toast `role="status"` 1,5 s) doublé d'un `<a href="mailto:">` visible « ou ouvrir votre messagerie ».
- Liens : LinkedIn, GitHub, Apprentus (↗), téléphone (`tel:+32472813831`), tous magnétiques. **Pas de formulaire** en phase 1 (le Google Form actuel reste listé dans l'inventaire si Ahmad veut un lien « formulaire » discret).
- Footer : `© {année} Ahmad Barutchi · Conçu et codé à Mons` · heure locale (même script que le hero) · lien « Source ↗ » vers le repo · « ↑ » retour en haut (`scroll-behavior: smooth` CSS, pas JS) · « ♪ » avec `title`/tooltip CSS.

### 6.10 `pages/projets/[slug].astro` (étude de cas)

- Rendu depuis la collection `projects` (Markdown + frontmatter : `title, summary, year, kind, team, readingTime, stack[], repo, cover, order`).
- En-tête : fil d'Ariane « ← Projets », méta mono, `h1`, image de couverture (view transition).
- Corps : mesure 68 ch, `h2/h3` ancrés, sommaire sticky généré depuis les `headings` d'Astro, figures avec légendes, `<dialog>` de zoom (1 composant `Figure.astro` + 10 lignes JS).
- Pied : projet suivant/précédent.

### 6.11 `404.astro`

Champ de points statique, « 404 — Signal perdu. », lien « Retour à l'accueil ». Firebase sert `dist/404.html` automatiquement.

---

## 7. Contenu — inventaire complet et copy corrigée

Tout ce qui suit vient du site actuel (fautes corrigées, formulations resserrées). Les éléments marqués **[proposé]** sont nouveaux et doivent être validés par Ahmad ; les éléments marqués **[décision Ahmad]** sont listés en section 11.

### 7.1 Profil (`profile.json`)

| Champ | Valeur |
|---|---|
| Nom | Ahmad Barutchi |
| Titre | Développeur full-stack **[proposé]** (actuel : « Développeur en Informatique junior ») |
| Accroche hero | « Développeur *full-stack*. Python, Odoo, Angular. » **[proposé]** |
| Statut | « Ouvert aux opportunités » **[décision Ahmad]** — champ `availability: "open" | "busy" | null` |
| Localisation | 7000 Mons, Belgique |
| E-mail | ahmad.barutchi@gmail.com |
| Téléphone | 0472 813 831 → `tel:+32472813831` **[décision Ahmad : afficher ou non]** |
| LinkedIn | https://www.linkedin.com/in/ahmad-barutchi-b5b035114/ |
| GitHub | https://github.com/ahmad-barutchi |
| Apprentus | https://apprentus.be/ahmad.barutchi |
| CV PDF | https://drive.google.com/uc?export=download&id=1dYTCjxuQPhW2vZnqT91PAWvk5jZBQs5Q — **à remplacer** par `public/cv-ahmad-barutchi.pdf` si Ahmad fournit le fichier **[décision Ahmad]** |
| Formulaire (ancien contact) | https://docs.google.com/forms/d/e/1FAIpQLSfhZKVILfDdha46OoCo1PmIl_9ITafOEm9Qn_8wYW7yc5HDng/viewform |
| Langues | Français C2 · Anglais C1 · Arabe C2 |
| Permis | B, depuis 2014 |
| Âge | le site dit « 31 ans » en dur ; **ne pas reproduire** : omettre, ou stocker `birthDate` et calculer **[décision Ahmad]** |
| Fuseau | Europe/Brussels |

### 7.2 Récit « À propos » **[proposé, à valider]**

Bio actuelle (à ne pas garder telle quelle) : « Âgé de 31 ans, je suis développeur en informatique diplômé en bachelier informatique et Systèmes, orientation Réseaux et Télécommunications de la Haute école en Hainaut - Mons. »

Proposition, uniquement à partir des faits présents sur le site :

> Je suis développeur full-stack, basé à Mons. J'ai passé un an chez BHC à construire des modules Odoo en Python et JavaScript, après deux stages web (monitoring Angular au CETIC, services web chez ACEA) et un bachelier en Informatique et Systèmes, orientation Réseaux et Télécommunications, à la HEH.
>
> Mon parcours a commencé ailleurs : des études d'ingénierie des équipements médicaux à Alep, deux ans de bénévolat au Croissant-Rouge, puis l'arrivée en Belgique, le français appris de A1 à B2 en un an, et un détour par une école d'art à Gand avant de choisir le code.
>
> Mon travail de fin d'études était un robot secouriste qui remonte sa télémétrie vers un tableau de bord web et mobile. Depuis 2016, je donne aussi des cours particuliers d'informatique et de musique. Trois langues, un permis B, et l'envie de construire des outils utiles.

### 7.3 Expériences (`experiences.json`, ordre antichronologique)

| # | Période | Rôle | Organisation | Lieu | Description | Chips | Featured |
|---|---|---|---|---|---|---|---|
| 1 | Sept 2023 – Oct 2024 | Software Engineer | BHC sprl | Mons, Belgique | Développeur Odoo, Python / JavaScript | Odoo, Python, JavaScript, PostgreSQL **[PostgreSQL proposé, cohérent avec la liste Logiciels]** | oui |
| 2 | Fév – mai 2022 | Stage | CETIC asbl (hybride) | Charleroi, Belgique | Développement d'une application web de monitoring, Angular | Angular, TypeScript | |
| 3 | Fév – mai 2021 | Stage | ACEA (à distance) | Bruxelles, Belgique | Développement d'une application web service, WinDev et Python | WinDev, Python | |
| 4 | Juin – déc 2019 | Job étudiant | La Cédraie | Mons, Belgique | Restauration rapide | | |
| 5 | Depuis août 2016 | Professeur particulier | Apprentus | Belgique | Cours d'informatique et de musique, à domicile et à distance · lien apprentus.be/ahmad.barutchi | | |
| 6 | 2013 – 2015 | Bénévole | Croissant-Rouge | Alep, Syrie | Distribution de colis alimentaires, soutien émotionnel aux enfants atteints de cancer, secouriste | | |

### 7.4 Formations (`education.json`)

| # | Période | École | Lieu | Intitulé | Lien |
|---|---|---|---|---|---|
| 1 | 2017 – 2022 | HEH — Haute École en Hainaut | Mons, Belgique | Bachelier en Informatique et Systèmes, orientation Réseaux et Télécommunications (option développement) | |
| 2 | 2016 – 2017 | Promotion sociale de Mons | Mons | Apprentissage du français, niveaux A1 à B2 | |
| 3 | 2 mai – 23 juin 2016 | KASK / School of Arts, HoGent | Gand, Belgique | Open Design Course (formation en art) | https://opendesigncourse.be |
| 4 | Juin – sept 2015 | AIC4T — American International Center for Training | Alep | Formateur professionnel | |
| 5 | 2013 – 2015 | Université d'Alep | Alep, Syrie | Diplôme en ingénierie technique des équipements médicaux | |

### 7.5 Compétences (`skills.json`)

Profil : développeur full-stack (front-end, back-end), développement mobile (Android), applications web.

| Groupe | Chips (site actuel) | Ajouts **[proposés]** (justifiés par le TFE et BHC) |
|---|---|---|
| Langages | Python, Java, C#, SQL, PHP | JavaScript, TypeScript |
| Frameworks | Odoo, Flask, Spring Boot, Angular, React, PyMongo | Capacitor |
| Outils | Git, Docker, IntelliJ IDEA, Android Studio, MySQL, PostgreSQL | MongoDB, Swagger, Arduino |
| Concepts | Linux, Programmation orientée objet, Algorithmique | API REST, JWT |

Liens pour la carte de stack (`links`) : Odoo → Python, JavaScript, PostgreSQL · Flask → Python, PyMongo, MongoDB, Swagger, JWT · Angular → TypeScript, Capacitor · Spring Boot → Java · React → JavaScript · PyMongo → Python, MongoDB · Android Studio → Java, Capacitor · Docker → Linux.

### 7.6 Projets (`projects/*.md`) et hackathons (`hackathons.json`)

**Projet vedette — Robot secouriste (TFE 2022)**

- Titre : Prototypage d'un robot secouriste
- Résumé : Mise en œuvre d'un robot et d'une application web et mobile pour le monitoring des données qu'il génère (IoT).
- Équipe : binôme, Ahmad Barutchi et Younes Zahouane ; méthode agile Kanban.
- Repo : https://github.com/ahmad-barutchi/RescueRobot
- Temps de lecture : 3 min
- Stack : Python (Flask, PyMongo, JWT, unittest) · Angular 13+ (template ngx-admin, Akveo) · Arduino (module de contrôle du robot) · Swagger (documentation de l'API Flask) · MongoDB · Capacitor (application Android)
- Corps de l'étude de cas (copy corrigée) :

  **Contexte.** Le but du projet est la mise en œuvre du robot et d'une application web et mobile pour la surveillance (monitoring) des données générées par le robot (IoT). L'application est basée sur le template de monitoring ngx-admin.

  **Ngx-admin.** Pour développer l'application web, il a fallu choisir les outils et le framework. Plusieurs solutions de monitoring existent ; pour ne pas réinventer la roue, Akveo propose des tableaux de bord d'administration qui permettent de faire du monitoring de données et d'y implémenter n'importe quel type de composant. Ngx-admin est un modèle Angular créé par Akveo, open source et gratuit, construit sur Angular 13+ avec Eva Design System et Nebular.

  **Gestion des utilisateurs.** Pour accéder au tableau de bord qui donne accès aux données des séances de recherche du robot, l'utilisateur arrive d'abord sur une page de connexion / inscription. Les administrateurs ont un affichage personnalisé qui les différencie des utilisateurs clients ; les mots de passe en base MongoDB sont hachés en SHA-256 et SHA-512.

  **Visualisation.** Un graphe compare les valeurs relevées par le robot (température avant, température arrière, température ambiante, humidité) avec les courbes de prédiction d'une présence vivante ou d'une source potentielle de feu ou d'inondation. Les boutons colorés filtrent les courbes. Les données sont aussi affichées dans un tableau pour permettre des recherches par catégorie ou par valeur : l'utilisateur se concentre sur la colonne « Origin » pour savoir s'il s'agit d'un être humain ou d'un feu (toute la logique est dans le back-end), puis regarde la position GPS, l'heure de détection et les probabilités ; une probabilité plus élevée est traitée en priorité. Les séances peuvent être consultées ou supprimées.

  **JWT.** Les JSON Web Tokens sécurisent l'API : le serveur renvoie un token que l'utilisateur inclut dans ses requêtes pour prouver son identité.

  **Swagger.** Swagger décrit la structure de l'API et liste toutes les routes. On y voit l'URL de la requête, la commande curl équivalente et la réponse JSON (code 200), par exemple pour tester la route `POST /login`.

  **Application mobile.** Avec Capacitor, une application Android a été générée. Capacitor est un moteur d'exécution natif multiplateforme qui permet de faire tourner des applications web modernes en natif sur iOS et Android. Dans le graphe, l'échelle de temps peut être agrandie (zoom).

  **Partie matérielle.** Schéma électrique du robot (figure).

  **Équipe et méthode.** Projet réalisé en binôme avec Younes Zahouane, tâches réparties avec la méthode Kanban.

- Figures (à rapatrier, voir annexe A), avec alt proposés :

  | Fichier cible | Source imgur | Alt / légende |
  |---|---|---|
  | `graphe-predictions.png` (couverture) | `DbPLA27.png` | Graphe comparant les températures et l'humidité relevées par le robot aux courbes de prédiction |
  | `login.png` | `3GJAfyn.png` | Page de connexion et d'inscription du tableau de bord |
  | `admin-hash.png` | `96GXP5M.png` | Vue administrateur et exemple de mots de passe hachés en base MongoDB |
  | `tableau-detections.png` | `FVy2Jz7.png` | Tableau des détections avec la colonne Origin, la position GPS, l'heure et les probabilités |
  | `seances.png` | `hJnMUAJ.png` | Gestion des séances de recherche |
  | `jwt.png` | `NvnJufF.png` | Réponse de l'API contenant un token JWT |
  | `swagger-routes.png` | `UsNfTMB.png` | Liste des routes de l'API dans Swagger |
  | `swagger-login.png` | `Ijt8tmP.png` | Test de la route POST /login dans Swagger |
  | `android-1.png`, `android-2.png`, `android-3.png` | `zFGTGOa.png`, `iBNJ47Y.png`, `YqBqYde.png` | Captures de l'application Android (trois écrans) |
  | `schema-electrique.png` | `KNOxrqa.png` | Schéma électrique du robot |

**Autres projets**

| Slug | Titre | Étiquette | Année | Lien | Description |
|---|---|---|---|---|---|
| `deepvision` | DeepVision | Hackathon CSLabs « Le Handicap », UNamur | Fév 2023 | https://github.com/ahmad-barutchi/DeepVision | Aucune description sur le site actuel. Lire le README public du repo si accessible, sinon demander une phrase à Ahmad **[décision Ahmad]** |
| `single-digital-gateway` | Single Digital Gateway | Hackathon, BeCentral Bruxelles | Mar 2019 | https://github.com/sdghack2019/brussels-challenge | idem |
| `portfolio` | Ce portfolio | Site personnel | v1 fév 2023 (Angular 13 + Firebase) → v2 2026 (Astro) | https://github.com/ahmad-barutchi/Portfolio | « Conçu et codé de zéro, 0 KB de framework, 100/100 Lighthouse » **[proposé, à vérifier une fois mesuré]** |

**Journal des hackathons** (7 lignes)

| Date | Événement | Lieu | Lien |
|---|---|---|---|
| Fév 2023 | CSLabs : Le Handicap | UNamur | GitHub DeepVision |
| Mar 2020 | Citizens of Wallonia | ULiège | |
| Oct 2019 | CSLabs : Hope for Climate | UNamur | |
| Avr 2019 | Space Office Hackathon | MIC, Mons | |
| Mar 2019 | Single Digital Gateway | BeCentral, Bruxelles | GitHub sdghack2019/brussels-challenge |
| Mar 2019 | Citizens of Wallonia | UMons | |
| Oct 2018 | CSLabs : Smart Rurality | UNamur | |

### 7.7 Contenu abandonné

- Page « About » (« Bienvenue dans mon portfolio responsive… Angular 13 ») : remplacée par la tuile Portfolio.
- Bandeau décoratif `transition-pic` du home (image `https://i.imgur.com/0DsKnFA.jpg` avec effet de survol jaune) : abandonné ; vérifier le contenu de l'image avant de décider s'il mérite une place dans « À propos ».
- Spinners de langues, icônes Material, bulles roses, photos `bg1..bg5.jpg` et `a.jpg`.
- Route `/projects` (doublon non lié).

### 7.8 Méta SEO

- `<title>` : « Ahmad Barutchi — Développeur full-stack à Mons »
- Description : « Développeur full-stack basé à Mons (Python, Odoo, Angular). Parcours, projets dont un robot secouriste IoT, et contact. »
- Canonical : `https://abarutchi.web.app/`
- JSON-LD : `Person` { name, jobTitle: "Développeur full-stack", address.addressLocality: "Mons", address.addressCountry: "BE", email, sameAs: [LinkedIn, GitHub, Apprentus] }
- `robots.txt` + `sitemap` via `@astrojs/sitemap`.

---

## 8. Performance, accessibilité, SEO — budgets et checklist

### 8.1 Budgets (bloquants)

| Ressource | Actuel | Cible |
|---|---|---|
| JS total (gzip) | 142 KB + 34 KB polyfills | **≤ 15 KB** site entier, **≤ 5 KB** sur `/` hors canvas (canvas ≤ 2,5 KB) |
| CSS (gzip) | 13 KB (114 KB brut, Material) | **≤ 20 KB** |
| Polices | 5 fichiers tiers (Google Fonts) | **3 fichiers woff2 auto-hébergés, ≤ 100 KB** au total |
| Image LCP | hero = texte (bien) ; portrait 433 KB | portrait **≤ 45 KB** en AVIF 720 px, `srcset` 480/720/960 |
| Poids total `/` (sans cache) | > 1 MB | **≤ 250 KB** |
| Requêtes tierces | Google Fonts, imgur, Google Forms, Wikipedia, GitHub assets, smartbear, mongodb | **0** |
| Lighthouse mobile (Perf / A11y / BP / SEO) | non mesuré | **≥ 95 / 100 / 100 / 100**, objectif 100 partout |
| CLS | — | 0 (dimensions d'images explicites, polices avec `size-adjust`) |
| INP | — | < 100 ms (le canvas ne bloque jamais le thread : rAF conditionnel, pas d'allocation par frame) |

### 8.2 Accessibilité (WCAG 2.2 AA)

- Contrastes du tableau 4.1 respectés ; accent en texte petit sur fond clair = `--accent-text`.
- `:focus-visible` : anneau 2 px `--accent` + offset 3 px, partout (boutons, chips, liens, cartes).
- Skip link, landmarks, un seul `h1` par page, hiérarchie `h2/h3` stricte, `aria-current` sur l'item de nav actif, `aria-labelledby` sur les sections.
- Overlay mobile : `aria-modal`, focus piégé, Échap ferme, retour du focus sur ☰.
- `<dialog>` de zoom : fermeture Échap et clic extérieur, `aria-label` sur le bouton fermer.
- Canvas `aria-hidden="true"` ; aucune information portée uniquement par le canvas ou la couleur.
- `prefers-reduced-motion` : tout mouvement non essentiel à 0 (section 4.4).
- Cibles tactiles ≥ 44×44 px ; toast en `role="status"`.
- `lang="fr"`, textes alternatifs du tableau 7.6, liens externes avec « ↗ » et `rel="noopener"`.

### 8.3 Vérifications à exécuter avant de livrer

1. `npm run check` (`astro check`) et `npm run build` sans avertissement.
2. Taille : lister `dist/_astro/*.js` et `*.css` gzippés, comparer aux budgets ; échouer si dépassés (petit script `scripts/budget.mjs`).
3. Playwright (Chromium préinstallé) : `/` se rend sans erreur console, les 5 ancres de nav fonctionnent, `/projets/robot-secouriste` s'ouvre, `/404` est servi, bascule de thème persistante, `reduced-motion` émulé → pas d'animation, viewport 375 px sans défilement horizontal.
4. Lighthouse mobile sur `/` et sur l'étude de cas (`npx lighthouse --chrome-flags="--headless"` avec `CHROME_PATH=/opt/pw-browsers/chromium`), scores ≥ seuils.
5. Zéro requête vers un domaine externe (vérifier dans la trace réseau Playwright).
6. Tous les liens externes répondent 200 (script simple avec `fetch`, HEAD puis GET).
7. Test visuel des deux thèmes à 375 / 768 / 1280 / 1920 px (captures Playwright committées dans `docs/screenshots/` pour la revue).

---

## 9. Structure cible du repo, Firebase, CI

### 9.1 Arborescence

```
/                             ← racine = projet Astro (plus de sous-dossier portfolio/)
├─ HANDOVER.md                ← ce document (le conserver)
├─ README.md                  ← réécrit : stack, scripts, déploiement
├─ package.json / package-lock.json
├─ astro.config.ts            ← site: 'https://abarutchi.web.app', output 'static', build.format 'file', integrations: sitemap
├─ tsconfig.json              ← extends astro/tsconfigs/strict
├─ .prettierrc                ← + prettier-plugin-astro
├─ firebase.json / .firebaserc
├─ .github/workflows/deploy.yml
├─ public/
│  ├─ favicon.svg · apple-touch-icon.png · og.png · robots.txt
│  └─ cv-ahmad-barutchi.pdf   (si fourni)
├─ scripts/
│  ├─ budget.mjs              ← vérifie les tailles gzip
│  └─ og.mjs                  ← génère public/og.png avec Playwright (exécution manuelle)
├─ src/
│  ├─ styles/
│  │  ├─ tokens.css           ← section 4 (couleurs, typo, espaces, motion), les deux thèmes
│  │  ├─ base.css             ← reset léger, @layer, typographie, focus, reduced-motion
│  │  ├─ motion.css           ← keyframes, scroll-driven, view transitions
│  │  └─ utilities.css        ← .mono, .container, .visually-hidden, .reveal
│  ├─ layouts/Base.astro
│  ├─ components/
│  │  ├─ Nav.astro · ThemeToggle.astro · MobileMenu.astro
│  │  ├─ Hero.astro · SignalField.astro
│  │  ├─ Section.astro · About.astro · Facts.astro
│  │  ├─ Timeline.astro · EducationGrid.astro
│  │  ├─ ProjectGrid.astro · ProjectCard.astro · HackathonLog.astro
│  │  ├─ SkillMap.astro
│  │  ├─ Contact.astro · Footer.astro
│  │  ├─ Figure.astro · ImageDialog.astro · Toc.astro
│  │  └─ Icon.astro            ← SVG inline par nom
│  ├─ scripts/
│  │  ├─ theme.ts · nav.ts · signal-field.ts · pointer.ts (halo + magnétisme + tilt)
│  │  ├─ clock.ts · copy.ts · skills.ts · dialog.ts
│  ├─ content/
│  │  ├─ config.ts            ← schémas zod des collections
│  │  ├─ profile.json · experiences.json · education.json · hackathons.json · skills.json
│  │  └─ projects/
│  │     ├─ robot-secouriste.md · deepvision.md · single-digital-gateway.md · portfolio.md
│  ├─ assets/
│  │  ├─ portrait.jpg         ← recadré 3:4 depuis l'actuel « Ahmad Barutchi.jpg »
│  │  └─ projects/robot-secouriste/*.png   ← 12 captures rapatriées (annexe A)
│  └─ pages/
│     ├─ index.astro · 404.astro
│     └─ projets/[slug].astro
└─ docs/screenshots/          ← captures de revue (facultatif)
```

À **supprimer** : `portfolio/` entier (Angular, build committé, `.firebase/` caches), `package.json` et `package-lock.json` racine actuels (dépendance `animejs` orpheline), `.idea/`. Ajouter `.gitignore` Astro standard (`dist/`, `node_modules/`, `.astro/`, `.firebase/`).

### 9.2 Firebase Hosting

`firebase.json` :

- `hosting.public: "dist"`, `cleanUrls: true`, `trailingSlash: false` (avec `build.format: 'file'` côté Astro, `/projets/robot-secouriste.html` est servi sur `/projets/robot-secouriste`).
- **Pas** de rewrite SPA vers `index.html` (site multi-pages ; Firebase sert `404.html`).
- Headers : `/_astro/**` → `Cache-Control: public, max-age=31536000, immutable` ; `**/*.@(avif|webp|png|jpg|svg|woff2)` → idem ; `**/*.html` → `max-age=0, must-revalidate`. Ajouter `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal.
- `.firebaserc` : `"default": "abarutchi"`. **Correction** : l'ancien `.firebaserc` disait `ahmad-barutchi`, mais la configuration Firebase de l'ancien site (`portfolio/public/firebase.js`) indique `projectId: "abarutchi"`, et `abarutchi.web.app` est le site par défaut de ce projet.
- Test local : `npm run build && npx firebase-tools emulators:start --only hosting`.

### 9.3 GitHub Actions (`deploy.yml`)

- Déclencheurs : `push` sur `master` → déploiement `live` ; `pull_request` → preview channel (expire 7 jours).
- Étapes : checkout, `actions/setup-node` (LTS, cache npm), `npm ci`, `npm run check`, `npm run build`, `node scripts/budget.mjs`, `FirebaseExtended/action-hosting-deploy@v0` avec `repoToken: ${{ secrets.GITHUB_TOKEN }}`, `firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_ABARUTCHI }}`, `projectId: abarutchi`, `channelId: live` (ou vide pour la preview).
- **Action Ahmad** : créer le secret via `firebase init hosting:github` (génère le compte de service et le secret dans le repo). En attendant, `npx firebase-tools deploy --only hosting` en local fonctionne.

### 9.4 Scripts npm

`dev`, `build`, `preview`, `check` (`astro check`), `format` (prettier), `test` (Playwright smoke), `budget`, `og`, `deploy` (`firebase deploy --only hosting`).

---

## 10. Plan de travail par phases

Chaque phase se termine par un commit sur `claude/portfolio-redesign-modern-5rzbqf` et un `npm run build` vert.

| Phase | Livrable | Critère de sortie |
|---|---|---|
| **0. Reset** | Projet Astro à la racine, suppression d'Angular, `.gitignore`, Prettier, `astro check` | `npm run build` produit `dist/index.html` ; repo < 2 MB hors `node_modules` |
| **1. Fondations** | `tokens.css`, `base.css`, polices auto-hébergées, `Base.astro`, thème (script inline + toggle), `Nav` desktop + overlay mobile, barre de progression | Les deux thèmes sans flash ; nav au clavier ; 0 requête tierce |
| **2. Hero** | `Hero`, `SignalField` (spec 6.3), horloge, CTA magnétiques, halo d'ambiance | 60 fps sur un laptop moyen, ≤ 2,5 KB, statique en reduced-motion, rAF arrêté hors viewport |
| **3. Sections** | `About` (portrait bichromie + tilt), `Timeline` + `EducationGrid`, `ProjectGrid` (bento + halo bordure + tilt vedette), `HackathonLog`, `SkillMap`, `Contact`, `Footer` ; collections de contenu remplies depuis la section 7 | Révélations scroll-driven ; contenu intégralement migré (relire 7.3–7.6 ligne à ligne) |
| **4. Étude de cas** | Rapatriement des 12 captures (annexe A), `projets/[slug].astro`, `Figure` + `ImageDialog`, sommaire sticky, view transitions `/` ↔ étude de cas, `404` | Transition visible dans Chromium ; images optimisées ; alt présents |
| **5. Finition** | Favicon SVG, `og.png`, JSON-LD, sitemap, robots, `budget.mjs`, Playwright smoke, Lighthouse, captures des deux thèmes | Tous les seuils de la section 8 atteints ; checklist 8.3 cochée |
| **6. Livraison** | `firebase.json`, `deploy.yml`, README réécrit, test avec l'émulateur Hosting | Déploiement manuel réussi ou workflow prêt (secret à fournir par Ahmad) |
| **P2 (optionnel)** | EN via i18n Astro, `/cv` imprimable, formulaire de contact (POST vers le `formResponse` du Google Form existant, sans iframe), easter egg ♪ | — |

### Definition of Done

- [ ] Tout le contenu de la section 7 est présent (aucun fait perdu, fautes corrigées).
- [ ] Budgets 8.1 respectés, mesurés et notés dans le README.
- [ ] Lighthouse mobile ≥ 95 / 100 / 100 / 100 sur `/` et l'étude de cas.
- [ ] 0 requête tierce, 0 erreur console, 0 défilement horizontal à 375 px.
- [ ] Deux thèmes, reduced-motion, clavier, lecteur d'écran (landmarks, alt, focus) vérifiés.
- [ ] Transition de vue tuile → étude de cas fonctionnelle (et dégradée proprement ailleurs).
- [ ] L'ancien code Angular et les 5,8 MB d'images inutiles ont disparu du dépôt.
- [ ] `firebase.json` testé avec l'émulateur ; workflow de déploiement committé.

---

## 11. Décisions ouvertes pour Ahmad

Rien ne bloque le démarrage ; l'agent code avec les valeurs par défaut indiquées et Ahmad ajuste ensuite.

| # | Question | Défaut retenu |
|---|---|---|
| 1 | Statut dans le hero (« Ouvert aux opportunités » / « En poste » / rien) | « Ouvert aux opportunités » |
| 2 | Afficher le numéro de téléphone (déjà public sur le site actuel) | Oui, en `tel:` |
| 3 | Afficher l'âge | Non |
| 4 | Fournir `cv-ahmad-barutchi.pdf` pour l'héberger dans `public/` | Lien Google Drive actuel en attendant |
| 5 | Une phrase de description pour DeepVision et Single Digital Gateway | Étiquette hackathon seule |
| 6 | Valider / retoucher le récit 7.2 et le titre « Développeur full-stack » | Texte proposé |
| 7 | Garder le Google Form comme lien discret dans Contact | Non |
| 8 | Version anglaise (phase 2) | Plus tard |
| 9 | Nom de domaine personnalisé (ex. `ahmadbarutchi.be`) : Firebase le supporte gratuitement | `abarutchi.web.app` |
| 10 | Créer le secret Firebase pour GitHub Actions (`firebase init hosting:github`) | Déploiement manuel en attendant |

---

## Annexe A — Images à rapatrier (imgur → `src/assets/projects/robot-secouriste/`)

Télécharger en PNG, vérifier le contenu de chacune, convertir si besoin, nommer selon le tableau 7.6 :

```
https://i.imgur.com/DbPLA27.png   graphe-predictions.png (couverture + figure Visualisation)
https://i.imgur.com/3GJAfyn.png   login.png
https://i.imgur.com/96GXP5M.png   admin-hash.png
https://i.imgur.com/FVy2Jz7.png   tableau-detections.png
https://i.imgur.com/hJnMUAJ.png   seances.png
https://i.imgur.com/NvnJufF.png   jwt.png
https://i.imgur.com/UsNfTMB.png   swagger-routes.png
https://i.imgur.com/Ijt8tmP.png   swagger-login.png
https://i.imgur.com/zFGTGOa.png   android-1.png
https://i.imgur.com/iBNJ47Y.png   android-2.png
https://i.imgur.com/YqBqYde.png   android-3.png
https://i.imgur.com/KNOxrqa.png   schema-electrique.png
https://i.imgur.com/0DsKnFA.jpg   (bandeau du home actuel — à examiner, probablement à abandonner)
```

Si imgur est inaccessible depuis l'environnement de build, le build committé dans `portfolio/public/` ne contient **pas** ces images : demander à Ahmad de les fournir ou de confirmer qu'elles sont dans le repo `RescueRobot`.

## Annexe B — Liens externes du site actuel (tous à conserver)

```
https://www.linkedin.com/in/ahmad-barutchi-b5b035114/
https://github.com/ahmad-barutchi
https://github.com/ahmad-barutchi/RescueRobot
https://github.com/ahmad-barutchi/DeepVision
https://github.com/ahmad-barutchi/Portfolio
https://github.com/sdghack2019/brussels-challenge
https://apprentus.be/ahmad.barutchi
https://opendesigncourse.be
https://drive.google.com/uc?export=download&id=1dYTCjxuQPhW2vZnqT91PAWvk5jZBQs5Q   (CV PDF)
https://docs.google.com/forms/d/e/1FAIpQLSfhZKVILfDdha46OoCo1PmIl_9ITafOEm9Qn_8wYW7yc5HDng/viewform   (ancien formulaire)
```

## Annexe C — Glossaire rapide des choix CSS « 2026 » utilisés

- `animation-timeline: view()` / `scroll()` : animations pilotées par le scroll, sans JS. Toujours dans `@supports`.
- `@view-transition { navigation: auto }` : transitions entre documents ; `view-transition-name` apparie les éléments.
- `oklch()` + `color-mix()` : palette perceptuelle, variantes dérivées sans préprocesseur.
- Container queries (`@container`) pour les cartes bento qui changent de disposition selon leur taille, pas celle du viewport.
- `:has()` pour les états (ex. grille de compétences avec une chip survolée).
- `@starting-style` pour les entrées du toast et du `<dialog>`.
- `text-wrap: balance` sur les titres, `text-wrap: pretty` sur les paragraphes.
- `scroll-behavior: smooth` + `scroll-margin-top` sur les sections (nav fixe).
