/**
 * Étude de cas « Robot secouriste » (TFE 2022) — contenu structuré.
 * Copy corrigée de HANDOVER.md section 7.6 ; figures et textes alternatifs du
 * tableau 7.6 (fichiers rapatriés par `npm run fetch:images`, voir annexe A).
 *
 * Mini-balisage dans les paragraphes : `code` entre accents graves.
 * Les espaces insécables de la typographie française (avant : ; ! ? », après «)
 * sont posées automatiquement à l'export : écrire des espaces normales.
 */
import { FEATURED_PROJECT } from './site';

export type CaseFact = {
  label: string;
  value: string;
  /** Lien externe (ouvert dans un nouvel onglet). */
  href?: string;
};

export type CaseStackItem = {
  /** Technologie, affichée en chip mono. */
  name: string;
  /** Son rôle dans le projet. */
  role: string;
};

export type CaseFigureImage = {
  /** Nom du fichier dans src/assets/projects/robot-secouriste/, sans extension. */
  name: string;
  alt: string;
};

export type CaseFigure = {
  images: readonly CaseFigureImage[];
  /** Légende visible (figcaption). */
  caption: string;
  /** 'phones' : captures verticales côte à côte. */
  layout?: 'single' | 'phones';
  /** Index du paragraphe après lequel placer la figure ; par défaut, en fin de section. */
  after?: number;
};

export type CaseSection = {
  /** Ancre (id du titre). */
  id: string;
  /** 2 = chapitre (h2), 3 = sous-section (h3) du chapitre qui précède. */
  level: 2 | 3;
  title: string;
  /** Libellé court pour le sommaire (titre par défaut). */
  toc?: string;
  /** 'stack' : le chapitre affiche la stack (CASE_ROBOT.stack) sous son titre. */
  kind?: 'stack';
  paragraphs: readonly string[];
  figures?: readonly CaseFigure[];
};

/* --------------------------------------------------------------------------
   Méta, faits, stack
   -------------------------------------------------------------------------- */

export const CASE_ROBOT = {
  slug: FEATURED_PROJECT.slug,
  href: FEATURED_PROJECT.href,
  /** <title> de la page. */
  pageTitle: 'Robot secouriste — Ahmad Barutchi',
  description:
    'Étude de cas : le travail de fin d’études d’Ahmad Barutchi (2022), un robot secouriste et une application web et mobile pour le monitoring des données qu’il génère (IoT).',
  /** Titre complet ; le mot `titleEm` passe en Instrument Serif italique. */
  titleStart: 'Prototypage d’un robot',
  titleEm: 'secouriste',
  year: '2022',
  kind: 'TFE 2022',
  team: 'Binôme',
  readingTime: '3 min de lecture',
  summary:
    'Mise en œuvre d’un robot et d’une application web et mobile pour le monitoring des données qu’il génère (IoT).',
  members: ['Ahmad Barutchi', 'Younes Zahouane'],
  method: 'Agile, Kanban',
  repo: FEATURED_PROJECT.repo,
  repoLabel: 'RescueRobot',
  stack: [
    { name: 'Python', role: 'Flask, PyMongo, JWT, unittest' },
    { name: 'Angular 13+', role: 'Template ngx-admin d’Akveo' },
    { name: 'Arduino', role: 'Module de contrôle du robot' },
    { name: 'Swagger', role: 'Documentation de l’API Flask' },
    { name: 'MongoDB', role: 'Base de données' },
    { name: 'Capacitor', role: 'Application Android' },
  ] satisfies readonly CaseStackItem[],
} as const;

export const CASE_FACTS: readonly CaseFact[] = [
  { label: 'Équipe', value: `${CASE_ROBOT.members[0]} et ${CASE_ROBOT.members[1]}` },
  { label: 'Méthode', value: CASE_ROBOT.method },
  { label: 'Année', value: `${CASE_ROBOT.year} · Travail de fin d’études` },
  { label: 'Code', value: CASE_ROBOT.repoLabel, href: CASE_ROBOT.repo },
];

/* --------------------------------------------------------------------------
   Corps (HANDOVER 7.6, copy corrigée)
   -------------------------------------------------------------------------- */

const SECTIONS: readonly CaseSection[] = [
  {
    id: 'contexte',
    level: 2,
    title: 'Contexte',
    paragraphs: [
      'Le but du projet est la mise en œuvre du robot et d’une application web et mobile pour la surveillance (monitoring) des données générées par le robot (IoT). L’application est basée sur le template de monitoring ngx-admin.',
    ],
  },
  {
    id: 'stack',
    level: 2,
    title: 'Stack',
    kind: 'stack',
    paragraphs: [],
  },
  {
    id: 'logiciel',
    level: 2,
    title: 'Partie logicielle',
    toc: 'Logiciel',
    paragraphs: [],
  },
  {
    id: 'ngx-admin',
    level: 3,
    title: 'Ngx-admin',
    paragraphs: [
      'Pour développer l’application web, il a fallu choisir les outils et le framework. Plusieurs solutions de monitoring existent ; pour ne pas réinventer la roue, Akveo propose des tableaux de bord d’administration qui permettent de faire du monitoring de données et d’y implémenter n’importe quel type de composant.',
      'Ngx-admin est un modèle Angular créé par Akveo, open source et gratuit, construit sur Angular 13+ avec Eva Design System et Nebular.',
    ],
  },
  {
    id: 'utilisateurs',
    level: 3,
    title: 'Gestion des utilisateurs',
    toc: 'Utilisateurs',
    paragraphs: [
      'Pour accéder au tableau de bord qui donne accès aux données des séances de recherche du robot, l’utilisateur arrive d’abord sur une page de connexion / inscription.',
      'Les administrateurs ont un affichage personnalisé qui les différencie des utilisateurs clients ; les mots de passe en base MongoDB sont hachés en SHA-256 et SHA-512.',
    ],
    figures: [
      {
        after: 0,
        images: [{ name: 'login', alt: 'Page de connexion et d’inscription du tableau de bord' }],
        caption: 'Page de connexion et d’inscription du tableau de bord',
      },
      {
        images: [
          {
            name: 'admin-hash',
            alt: 'Vue administrateur et exemple de mots de passe hachés en base MongoDB',
          },
        ],
        caption: 'Vue administrateur et exemple de mots de passe hachés en base MongoDB',
      },
    ],
  },
  {
    id: 'visualisation',
    level: 3,
    title: 'Visualisation',
    paragraphs: [
      'Un graphe compare les valeurs relevées par le robot (température avant, température arrière, température ambiante, humidité) avec les courbes de prédiction d’une présence vivante ou d’une source potentielle de feu ou d’inondation. Les boutons colorés filtrent les courbes.',
      'Les données sont aussi affichées dans un tableau pour permettre des recherches par catégorie ou par valeur : l’utilisateur se concentre sur la colonne « Origin » pour savoir s’il s’agit d’un être humain ou d’un feu (toute la logique est dans le back-end), puis regarde la position GPS, l’heure de détection et les probabilités ; une probabilité plus élevée est traitée en priorité.',
      'Les séances peuvent être consultées ou supprimées.',
    ],
    figures: [
      {
        after: 0,
        images: [
          {
            name: 'graphe-predictions',
            alt: 'Graphe comparant les températures et l’humidité relevées par le robot aux courbes de prédiction',
          },
        ],
        caption:
          'Graphe comparant les températures et l’humidité relevées par le robot aux courbes de prédiction',
      },
      {
        after: 1,
        images: [
          {
            name: 'tableau-detections',
            alt: 'Tableau des détections avec la colonne Origin, la position GPS, l’heure et les probabilités',
          },
        ],
        caption:
          'Tableau des détections avec la colonne Origin, la position GPS, l’heure et les probabilités',
      },
      {
        images: [{ name: 'seances', alt: 'Gestion des séances de recherche' }],
        caption: 'Gestion des séances de recherche',
      },
    ],
  },
  {
    id: 'jwt',
    level: 3,
    title: 'JWT',
    paragraphs: [
      'Les JSON Web Tokens sécurisent l’API : le serveur renvoie un token que l’utilisateur inclut dans ses requêtes pour prouver son identité.',
    ],
    figures: [
      {
        images: [{ name: 'jwt', alt: 'Réponse de l’API contenant un token JWT' }],
        caption: 'Réponse de l’API contenant un token JWT',
      },
    ],
  },
  {
    id: 'swagger',
    level: 3,
    title: 'Swagger',
    paragraphs: [
      'Swagger décrit la structure de l’API et liste toutes les routes.',
      'On y voit l’URL de la requête, la commande curl équivalente et la réponse JSON (code 200), par exemple pour tester la route `POST /login`.',
    ],
    figures: [
      {
        after: 0,
        images: [{ name: 'swagger-routes', alt: 'Liste des routes de l’API dans Swagger' }],
        caption: 'Liste des routes de l’API dans Swagger',
      },
      {
        images: [{ name: 'swagger-login', alt: 'Test de la route POST /login dans Swagger' }],
        caption: 'Test de la route POST /login dans Swagger',
      },
    ],
  },
  {
    id: 'mobile',
    level: 3,
    title: 'Application mobile',
    toc: 'Mobile',
    paragraphs: [
      'Avec Capacitor, une application Android a été générée. Capacitor est un moteur d’exécution natif multiplateforme qui permet de faire tourner des applications web modernes en natif sur iOS et Android.',
      'Dans le graphe, l’échelle de temps peut être agrandie (zoom).',
    ],
    figures: [
      {
        layout: 'phones',
        images: [
          { name: 'android-1', alt: 'Application Android, premier écran' },
          { name: 'android-2', alt: 'Application Android, deuxième écran' },
          { name: 'android-3', alt: 'Application Android, troisième écran' },
        ],
        caption: 'Captures de l’application Android (trois écrans)',
      },
    ],
  },
  {
    id: 'materiel',
    level: 2,
    title: 'Partie matérielle',
    toc: 'Matériel',
    paragraphs: ['Côté matériel, le robot est piloté par un module de contrôle Arduino.'],
    figures: [
      {
        images: [{ name: 'schema-electrique', alt: 'Schéma électrique du robot' }],
        caption: 'Schéma électrique du robot',
      },
    ],
  },
  {
    id: 'equipe',
    level: 2,
    title: 'Équipe et méthode',
    toc: 'Équipe',
    paragraphs: [
      'Projet réalisé en binôme avec Younes Zahouane ; les tâches étaient réparties avec la méthode agile Kanban.',
    ],
  },
];

/* --------------------------------------------------------------------------
   Typographie française : espaces insécables
   -------------------------------------------------------------------------- */

const NBSP = ' ';

/** Pose les espaces insécables avant : ; ! ? » et après «. */
export function frenchSpacing(text: string): string {
  return text.replace(/ ([:;!?»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);
}

export const CASE_SECTIONS: readonly CaseSection[] = SECTIONS.map((s) => ({
  ...s,
  paragraphs: s.paragraphs.map(frenchSpacing),
}));

/** Découpe un paragraphe en segments texte / `code`. */
export function splitCode(text: string): Array<{ text: string; code: boolean }> {
  return text
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`')
        ? { text: part.slice(1, -1), code: true }
        : { text: part, code: false },
    );
}
