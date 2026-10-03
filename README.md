# Portfolio — Ahmad Barutchi

Site personnel d'Ahmad Barutchi, informaticien industriel et développeur full-stack à Namur : [abarutchi.web.app](https://abarutchi.web.app).

Design « SIGNAL » : encre bleu-nuit, un seul accent ambre, un champ de points vivant dans le hero, typographie éditoriale. Thèmes sombre et clair, responsive, accessible, et très léger.

## Stack

- **Astro 7** en sortie 100 % statique, **TypeScript** strict, **CSS natif** (jetons `oklch`, animations pilotées par le scroll, transitions de vue entre pages).
- Aucun framework UI, aucune bibliothèque d'animation, aucune requête vers un autre domaine.
- Polices auto-hébergées (Geist, Geist Mono, Instrument Serif) via l'API Fonts d'Astro, avec polices de secours aux métriques ajustées.
- Hébergement **Firebase Hosting** (projet `abarutchi`), déploiement par GitHub Actions.

## Démarrer

```bash
npm install
npm run dev       # http://localhost:4321
```

| Script                 | Rôle                                                      |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Serveur de développement                                  |
| `npm run build`        | Construit le site dans `dist/`                            |
| `npm run preview`      | Sert le build                                             |
| `npm run check`        | Vérification TypeScript et Astro                          |
| `npm run format`       | Prettier                                                  |
| `npm test`             | Tests de fumée Playwright (après `npm run build`)         |
| `npm run budget`       | Contrôle des budgets de poids sur `dist/`                 |
| `npm run og`           | Régénère `public/og.png` et `public/apple-touch-icon.png` |
| `npm run fetch:images` | Télécharge les captures de l'étude de cas                 |
| `npm run deploy`       | Déploie sur Firebase (après `npm run build`)              |

## Modifier le contenu

Tout le texte du site est dans **`src/data/site.ts`** : profil, statut de disponibilité, expériences, formations, projets, hackathons, compétences, contact. Le contenu de l'étude de cas est dans `src/data/case-robot.ts`.

- Ligne de statut du hero et du contact : `PROFILE.availability` vaut `'busy'` (« En poste à l’INASEP »), `'open'` (« Ouvert aux opportunités ») ou `null` (masquée).
- Héberger le CV : déposer `public/cv-ahmad-barutchi.pdf` puis mettre `PROFILE.cv = '/cv-ahmad-barutchi.pdf'`.

## Captures de l'étude de cas

Les 12 captures du robot secouriste sont dans `src/assets/projects/robot-secouriste/` (rapatriées depuis imgur par `npm run fetch:images`, qui ne télécharge que celles qui manquent). Si une capture manque, sa figure n'est pas affichée et la couverture utilise une illustration du tableau de bord.

## Structure

```
src/
  components/      sections/ (Hero, About, Parcours, Projects, Skills, Contact),
                   hero/, projects/, case/, shell/ (menu mobile), Nav, Footer,
                   Section, Icon, DashboardFrame
  data/            site.ts (contenu), case-robot.ts (étude de cas)
  layouts/         Base.astro (SEO, polices, thème sans flash)
  pages/           index, projets/[slug], 404
  scripts/         signal-field, nav, theme, clock
  styles/          global.css (jetons et utilitaires)
public/            favicon, og.png, robots.txt
scripts/           budget, og, serve, fetch-tfe-images
tests/             tests de fumée Playwright
```

## Déploiement

Le projet Firebase est **`abarutchi`** (l'ancien `.firebaserc` indiquait `ahmad-barutchi` par erreur).

**À la main :**

```bash
npm run build
npx firebase-tools login
npx firebase-tools deploy --only hosting
```

**Automatique (en place)** : le secret `FIREBASE_SERVICE_ACCOUNT_ABARUTCHI` (créé par `npx firebase-tools init hosting:github`) est dans le dépôt GitHub. Chaque push sur `master` construit, teste et déploie, et chaque pull request reçoit une URL de prévisualisation. Sans ce secret, la CI construit et teste mais ignore le déploiement.

## Budgets

Mesurés par `npm run budget` (gzip) :

| Mesure                          | Mesuré  | Limite |
| ------------------------------- | ------- | ------ |
| JS total du site                | 14,1 Ko | 15 Ko  |
| JS de la page d'accueil         | 6,1 Ko  | 8 Ko   |
| CSS total                       | 19,9 Ko | 20 Ko  |
| Polices (3 fichiers woff2)      | 60,2 Ko | 100 Ko |
| Chargement initial de l'accueil | 73,7 Ko | 250 Ko |

L'ancien site Angular chargeait 142 Ko de JS gzip et 5 fichiers de polices depuis Google Fonts.

## Références

- Cahier des charges initial (vision design, tokens, spécifications) : `HANDOVER.md` dans l'historique git (supprimé une fois exécuté).
- Maquette interactive (privée) : https://claude.ai/artifact/Vvs6kQE2NkrDLKixhWypNH
