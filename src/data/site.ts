/**
 * Contenu du site — source unique de vérité.
 * Tout vient de l'ancien site (fautes corrigées) et de HANDOVER.md section 7.
 * Les descriptions de DeepVision et Single Digital Gateway ont été vérifiées
 * dans leurs dépôts publics (README, package.json, code).
 */

export const SITE = {
  url: 'https://abarutchi.web.app',
  name: 'Ahmad Barutchi',
  title: 'Ahmad Barutchi — Développeur full-stack à Mons',
  description:
    'Développeur full-stack basé à Mons (Python, Odoo, Angular). Parcours, projets dont un robot secouriste IoT, et contact.',
  locale: 'fr_BE',
  lang: 'fr',
  repo: 'https://github.com/ahmad-barutchi/portfolio',
  ogImage: '/og.png',
} as const;

export const PROFILE = {
  name: 'Ahmad Barutchi',
  firstName: 'Ahmad',
  lastName: 'Barutchi',
  role: 'Développeur full-stack',
  /** 'open' affiche « Ouvert aux opportunités » ; null masque la ligne de statut. */
  availability: 'open' as 'open' | 'busy' | null,
  availabilityLabel: {
    open: 'Ouvert aux opportunités',
    busy: 'En poste',
  },
  city: 'Mons',
  country: 'Belgique',
  countryCode: 'BE',
  postalCode: '7000',
  coords: '50.45° N · 3.95° E',
  timeZone: 'Europe/Brussels',
  email: 'ahmad.barutchi@gmail.com',
  phone: '0472 81 38 31',
  phoneHref: 'tel:+32472813831',
  linkedin: 'https://www.linkedin.com/in/ahmad-barutchi-b5b035114/',
  github: 'https://github.com/ahmad-barutchi',
  apprentus: 'https://apprentus.be/ahmad.barutchi',
  /** Remplacer par '/cv-ahmad-barutchi.pdf' quand le PDF est ajouté dans public/. */
  cv: 'https://drive.google.com/uc?export=download&id=1dYTCjxuQPhW2vZnqT91PAWvk5jZBQs5Q',
  languages: [
    { code: 'FR', name: 'Français', level: 'C2' },
    { code: 'EN', name: 'Anglais', level: 'C1' },
    { code: 'AR', name: 'Arabe', level: 'C2' },
  ],
  drivingLicense: 'B, depuis 2014',
} as const;

export type NavId = 'accueil' | 'a-propos' | 'parcours' | 'projets' | 'competences' | 'contact';

/** Navigation principale (la section Compétences n'y figure pas, comme prévu dans le handover). */
export const NAV: ReadonlyArray<{ id: NavId; label: string }> = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'projets', label: 'Projets' },
  { id: 'contact', label: 'Contact' },
];

/** Numérotation éditoriale des sections. */
export const SECTIONS = {
  'a-propos': { index: '01', label: 'À propos' },
  parcours: { index: '02', label: 'Parcours' },
  projets: { index: '03', label: 'Projets' },
  competences: { index: '04', label: 'Compétences' },
  contact: { index: '05', label: 'Contact' },
} as const;

export const HERO = {
  /** La partie en gras ; le mot entre astérisques passe en Instrument Serif italique. */
  ledeStrong: 'Développeur *full-stack* basé à Mons.',
  ledeRest: 'Python, Odoo et Angular, du capteur jusqu’au tableau de bord.',
  primaryCta: { label: 'Voir les projets', href: '#projets' },
  secondaryCta: { label: 'CV · PDF' },
} as const;

export const ABOUT = {
  /** HTML autorisé : <em> pour le mot en serif. */
  lead: 'Je suis développeur <em>full-stack</em>, basé à Mons. J’ai passé un an chez BHC à construire des modules Odoo en Python et JavaScript, après deux stages web et un bachelier en Informatique et Systèmes à la HEH.',
  paragraphs: [
    'Mon parcours a commencé ailleurs : des études d’ingénierie des équipements médicaux à Alep, deux ans de bénévolat au Croissant-Rouge, puis l’arrivée en Belgique. J’y ai appris le français de A1 à B2 en un an, et fait un détour par une école d’art à Gand avant de choisir le code.',
    'Mon travail de fin d’études était un robot secouriste qui remonte sa télémétrie vers un tableau de bord web et mobile. Depuis 2016, je donne aussi des cours particuliers d’informatique et de musique.',
  ],
  facts: [
    { label: 'Langues', value: 'FR C2 · EN C1 · AR C2' },
    { label: 'Permis', value: 'B, depuis 2014' },
    { label: 'Base', value: 'Mons, Belgique' },
    { label: 'Enseigne', value: 'Informatique et musique' },
  ],
  portraitAlt: 'Portrait d’Ahmad Barutchi, souriant, en chemise blanche',
} as const;

export type Experience = {
  year: string;
  role: string;
  org: string;
  place: string;
  mode?: string;
  period: string;
  description: string;
  stack?: readonly string[];
  link?: { label: string; href: string };
  featured?: boolean;
  badge?: string;
};

export const EXPERIENCES: readonly Experience[] = [
  {
    year: '2023',
    role: 'Software Engineer',
    org: 'BHC sprl',
    place: 'Mons, Belgique',
    period: 'Sept 2023 – Oct 2024',
    description: 'Développement Odoo en Python et JavaScript.',
    stack: ['Odoo', 'Python', 'JavaScript', 'PostgreSQL'],
    featured: true,
    badge: 'Dernier poste',
  },
  {
    year: '2022',
    role: 'Stage développeur web',
    org: 'CETIC asbl',
    place: 'Charleroi',
    mode: 'hybride',
    period: 'Fév – mai 2022',
    description: 'Développement d’une application web de monitoring en Angular.',
    stack: ['Angular', 'TypeScript'],
  },
  {
    year: '2021',
    role: 'Stage développeur',
    org: 'ACEA',
    place: 'Bruxelles',
    mode: 'à distance',
    period: 'Fév – mai 2021',
    description: 'Développement d’une application web service en WinDev et Python.',
    stack: ['WinDev', 'Python'],
  },
  {
    year: '2019',
    role: 'Job étudiant',
    org: 'La Cédraie',
    place: 'Mons, Belgique',
    period: 'Juin – déc 2019',
    description: 'Restauration rapide.',
  },
  {
    year: '2016',
    role: 'Professeur particulier',
    org: 'Apprentus',
    place: 'Belgique',
    period: 'Depuis août 2016',
    description: 'Cours d’informatique et de musique, à domicile et à distance.',
    link: { label: 'apprentus.be/ahmad.barutchi', href: 'https://apprentus.be/ahmad.barutchi' },
  },
  {
    year: '2013',
    role: 'Bénévole',
    org: 'Croissant-Rouge',
    place: 'Alep, Syrie',
    period: '2013 – 2015',
    description:
      'Distribution de colis alimentaires, soutien émotionnel aux enfants atteints de cancer, secouriste.',
  },
];

export type Education = {
  period: string;
  school: string;
  place: string;
  title: string;
  link?: { label: string; href: string };
  featured?: boolean;
};

export const EDUCATION: readonly Education[] = [
  {
    period: '2017 – 2022',
    school: 'HEH, Haute École en Hainaut',
    place: 'Mons, Belgique',
    title:
      'Bachelier en Informatique et Systèmes, orientation Réseaux et Télécommunications, option développement.',
    featured: true,
  },
  {
    period: '2016 – 2017',
    school: 'Promotion sociale de Mons',
    place: 'Mons, Belgique',
    title: 'Apprentissage du français, niveaux A1 à B2.',
  },
  {
    period: 'Mai – juin 2016',
    school: 'KASK / School of Arts, HoGent',
    place: 'Gand, Belgique',
    title: 'Open Design Course, formation en art.',
    link: { label: 'opendesigncourse.be', href: 'https://opendesigncourse.be' },
  },
  {
    period: 'Juin – sept 2015',
    school: 'AIC4T, American International Center for Training',
    place: 'Alep, Syrie',
    title: 'Formateur professionnel.',
  },
  {
    period: '2013 – 2015',
    school: 'Université d’Alep',
    place: 'Alep, Syrie',
    title: 'Diplôme en ingénierie technique des équipements médicaux.',
  },
];

export const FEATURED_PROJECT = {
  slug: 'robot-secouriste',
  href: '/projets/robot-secouriste',
  meta: 'TFE 2022 · Binôme · IoT',
  badge: 'Étude de cas',
  /** Le second mot passe en serif italique. */
  titleStart: 'Robot',
  titleEm: 'secouriste',
  title: 'Prototypage d’un robot secouriste',
  summary:
    'Un prototype qui détecte une présence humaine ou une source de feu, et transmet sa télémétrie à un tableau de bord web et Android.',
  stack: ['Flask', 'Angular', 'Arduino', 'MongoDB', 'Capacitor'],
  repo: 'https://github.com/ahmad-barutchi/RescueRobot',
} as const;

export type ProjectTile = {
  id: 'deepvision' | 'sdg' | 'portfolio';
  title: string;
  meta: string;
  sub: string;
  description: string;
  href: string;
  stack: readonly string[];
};

export const PROJECT_TILES: readonly ProjectTile[] = [
  {
    id: 'deepvision',
    title: 'DeepVision',
    meta: 'Hackathon · Fév 2023',
    sub: 'CSLabs · Le Handicap, UNamur',
    description:
      'Application web et Android qui envoie l’image de la caméra à une API Flask : MediaPipe y repère une présence humaine, annoncée par synthèse vocale. Équipe de six.',
    href: 'https://github.com/ahmad-barutchi/DeepVision',
    stack: ['Angular', 'Capacitor', 'Flask', 'MediaPipe'],
  },
  {
    id: 'sdg',
    title: 'Single Digital Gateway',
    meta: 'Hackathon · Mar 2019',
    sub: 'BeCentral, Bruxelles',
    description:
      'Prototype autour du portail européen Your Europe : application React, API web ASP.NET en C# et base SQL.',
    href: 'https://github.com/sdghack2019/brussels-challenge',
    stack: ['React', 'C#', 'ASP.NET', 'SQL'],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    meta: 'Ce site · v2 · 2026',
    sub: 'Astro, TypeScript, Firebase',
    description:
      'Conçu et codé de zéro : HTML statique, CSS natif, quelques kilo-octets de JavaScript.',
    href: 'https://github.com/ahmad-barutchi/portfolio',
    stack: ['Astro', 'TypeScript', 'CSS'],
  },
];

export const RADAR = {
  kicker: 'Base',
  caption: 'Là où j’ai travaillé, étudié et participé à des hackathons.',
} as const;

/**
 * Tuile radar « Mons. » : lieux où Ahmad a travaillé, étudié ou participé à des hackathons.
 * x, y en px depuis Mons (≈ 0,75 px/km, nord en haut) ; delay = angle / 360 × 4 s.
 */
export const RADAR_PLACES = [
  { code: 'BXL', name: 'Bruxelles', x: 21, y: -33, delay: 0.36 },
  { code: 'CRL', name: 'Charleroi', x: 26, y: 3, delay: 1.07, labelBelow: true },
  { code: 'NAM', name: 'Namur', x: 49, y: -2, delay: 0.97 },
  { code: 'LGE', name: 'Liège', x: 86, y: -15, delay: 0.89 },
  { code: 'GND', name: 'Gand', x: -12, y: -50, delay: 3.85 },
] as const;

export type Hackathon = {
  date: string;
  name: string;
  place: string;
  link?: { label: string; href: string };
};

export const HACKATHONS: readonly Hackathon[] = [
  {
    date: 'Fév 2023',
    name: 'CSLabs · Le Handicap',
    place: 'UNamur',
    link: { label: 'DeepVision sur GitHub', href: 'https://github.com/ahmad-barutchi/DeepVision' },
  },
  { date: 'Mar 2020', name: 'Citizens of Wallonia', place: 'ULiège' },
  { date: 'Oct 2019', name: 'CSLabs · Hope for Climate', place: 'UNamur' },
  { date: 'Avr 2019', name: 'Space Office Hackathon', place: 'MIC, Mons' },
  {
    date: 'Mar 2019',
    name: 'Single Digital Gateway',
    place: 'BeCentral, Bruxelles',
    link: {
      label: 'Single Digital Gateway sur GitHub',
      href: 'https://github.com/sdghack2019/brussels-challenge',
    },
  },
  { date: 'Mar 2019', name: 'Citizens of Wallonia', place: 'UMons' },
  { date: 'Oct 2018', name: 'CSLabs · Smart Rurality', place: 'UNamur' },
];

export type Skill = { id: string; label: string; links?: readonly string[] };

export const SKILLS_PROFILE =
  'Développeur full-stack (front-end, back-end), développement mobile (Android), applications web.';

/** Groupes de la carte de stack. `links` : compétences liées qui s'allument au survol (symétrisées à l'usage). */
export const SKILL_GROUPS: ReadonlyArray<{ id: string; label: string; items: readonly Skill[] }> = [
  {
    id: 'langages',
    label: 'Langages',
    items: [
      { id: 'python', label: 'Python' },
      { id: 'javascript', label: 'JavaScript' },
      { id: 'typescript', label: 'TypeScript' },
      { id: 'java', label: 'Java' },
      { id: 'csharp', label: 'C#' },
      { id: 'sql', label: 'SQL' },
      { id: 'php', label: 'PHP' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    items: [
      { id: 'odoo', label: 'Odoo', links: ['python', 'javascript', 'postgresql'] },
      {
        id: 'flask',
        label: 'Flask',
        links: ['python', 'pymongo', 'mongodb', 'swagger', 'jwt', 'rest'],
      },
      { id: 'angular', label: 'Angular', links: ['typescript', 'capacitor'] },
      { id: 'react', label: 'React', links: ['javascript'] },
      { id: 'spring', label: 'Spring Boot', links: ['java', 'rest'] },
      { id: 'pymongo', label: 'PyMongo', links: ['python', 'mongodb'] },
      { id: 'capacitor', label: 'Capacitor', links: ['angular', 'android-studio'] },
    ],
  },
  {
    id: 'outils',
    label: 'Outils',
    items: [
      { id: 'git', label: 'Git' },
      { id: 'docker', label: 'Docker', links: ['linux'] },
      { id: 'postgresql', label: 'PostgreSQL', links: ['sql'] },
      { id: 'mysql', label: 'MySQL', links: ['sql'] },
      { id: 'mongodb', label: 'MongoDB' },
      { id: 'swagger', label: 'Swagger', links: ['rest'] },
      { id: 'arduino', label: 'Arduino' },
      { id: 'intellij', label: 'IntelliJ IDEA', links: ['java'] },
      { id: 'android-studio', label: 'Android Studio', links: ['java'] },
    ],
  },
  {
    id: 'concepts',
    label: 'Concepts',
    items: [
      { id: 'linux', label: 'Linux' },
      { id: 'poo', label: 'Programmation orientée objet', links: ['java', 'python', 'csharp'] },
      { id: 'algo', label: 'Algorithmique' },
      { id: 'rest', label: 'API REST' },
      { id: 'jwt', label: 'JWT' },
    ],
  },
];

export const CONTACT = {
  /** Le mot entre astérisques passe en serif italique. */
  title: 'Travaillons *ensemble*.',
  intro: 'Un poste, une mission ou une question sur un projet : écrivez-moi.',
  links: [
    { id: 'linkedin', label: 'LinkedIn', href: PROFILE.linkedin },
    { id: 'github', label: 'GitHub', href: PROFILE.github },
    { id: 'apprentus', label: 'Apprentus', href: PROFILE.apprentus },
  ],
} as const;

/** Transforme « mot *accent* fin » en segments pour rendre le mot en serif italique. */
export function splitEmphasis(text: string): Array<{ text: string; em: boolean }> {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('*') && part.endsWith('*')
        ? { text: part.slice(1, -1), em: true }
        : { text: part, em: false },
    );
}
