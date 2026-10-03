/**
 * Libellés d'interface (boutons, aria-label, mentions) en français et en anglais.
 * Le contenu éditorial (parcours, projets, étude de cas) vit dans src/data/.
 */

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

const fr = {
  skip: 'Aller au contenu',
  brandTop: 'Ahmad Barutchi, haut de page',
  brandHome: 'Ahmad Barutchi, accueil',
  mainNav: 'Navigation principale',
  themeToLight: 'Passer au thème clair',
  cvDownload: 'Télécharger le CV (PDF)',
  cvDownloadPrefix: 'Télécharger le ',
  menu: 'Menu',
  menuOpen: 'Ouvrir le menu',
  menuClose: 'Fermer le menu',
  writeMe: 'M’écrire',
  /** Lien vers l'autre langue. */
  switchLabel: 'EN',
  switchAria: 'English version',
  switchLang: 'en',
  hero: {
    aria: 'Présentation',
    status: 'Statut',
    time: 'Heure',
    coordsAbbr: 'Coord.',
    coordsTitle: 'Coordonnées',
    scroll: 'Défiler',
    scrollHidden: ' jusqu’à la section À propos',
  },
  parcours: {
    summary: (xp: number, edu: number) =>
      `${plural(xp, 'expérience', 'expériences')} · ${plural(edu, 'formation', 'formations')}`,
    education: 'Formations',
    technologies: 'Technologies',
  },
  projects: {
    allOnGithub: 'Tout sur GitHub',
    newTab: ' (nouvel onglet)',
    readCase: 'Lire l’étude de cas',
    sourceCode: 'Code source',
    featuredSourceHidden: ' du robot secouriste sur GitHub (nouvel onglet)',
    tileAria: (title: string) => `${title}, code source sur GitHub (nouvel onglet)`,
    logTitle: 'Journal des hackathons',
    participations: (n: number) => (n > 1 ? `${n} participations` : `${n} participation`),
    languages: 'Langues',
    placesAround: (city: string) => `Lieux autour de ${city}`,
  },
  skills: {
    hint: 'Survolez ou touchez une compétence',
  },
  contact: {
    copy: 'Copier',
    copyHidden: ' : copier l’adresse dans le presse-papiers',
    openMail: 'ou ouvrir votre messagerie',
    copied: 'Adresse copiée',
  },
  footer: {
    made: (city: string) => `Conçu et codé à ${city}`,
    clockBefore: 'Il est',
    clockAfter: (city: string) => `à ${city}`,
    source: 'Code source',
    top: 'Haut de page',
    note: 'Note de musique',
    noteTip: 'Je donne aussi des cours de musique',
  },
  dashboard: {
    bar: 'Tableau de bord · Visualisation',
    alt: 'Graphe du tableau de bord : températures et humidité relevées par le robot, et courbes de prédiction',
    legend: ['Présence', 'T° avant', 'T° arrière', 'T° ambiante', 'Humidité'],
  },
  caseStudy: {
    crumb: 'Projets',
    onGithub: ' sur GitHub (nouvel onglet)',
    zoom: (alt: string) => `Agrandir l’image : ${alt}`,
    others: 'Autres projets',
    next: 'Projet suivant',
    all: 'Tous les projets',
    toc: 'Sommaire',
    closeImage: 'Fermer l’image',
  },
};

export type Ui = typeof fr;

const en: Ui = {
  skip: 'Skip to content',
  brandTop: 'Ahmad Barutchi, back to top',
  brandHome: 'Ahmad Barutchi, home',
  mainNav: 'Main navigation',
  themeToLight: 'Switch to light theme',
  cvDownload: 'Download the CV (PDF)',
  cvDownloadPrefix: 'Download the ',
  menu: 'Menu',
  menuOpen: 'Open the menu',
  menuClose: 'Close the menu',
  writeMe: 'Email me',
  switchLabel: 'FR',
  switchAria: 'Version française',
  switchLang: 'fr',
  hero: {
    aria: 'Introduction',
    status: 'Status',
    time: 'Time',
    coordsAbbr: 'Coord.',
    coordsTitle: 'Coordinates',
    scroll: 'Scroll',
    scrollHidden: ' to the About section',
  },
  parcours: {
    summary: (xp: number, edu: number) =>
      `${plural(xp, 'role', 'roles')} · ${plural(edu, 'school', 'schools')}`,
    education: 'Education',
    technologies: 'Technologies',
  },
  projects: {
    allOnGithub: 'Everything on GitHub',
    newTab: ' (new tab)',
    readCase: 'Read the case study',
    sourceCode: 'Source code',
    featuredSourceHidden: ' of the rescue robot on GitHub (new tab)',
    tileAria: (title: string) => `${title}, source code on GitHub (new tab)`,
    logTitle: 'Hackathon log',
    participations: (n: number) => (n > 1 ? `${n} hackathons` : `${n} hackathon`),
    languages: 'Languages',
    placesAround: (city: string) => `Places around ${city}`,
  },
  skills: {
    hint: 'Hover or tap a skill',
  },
  contact: {
    copy: 'Copy',
    copyHidden: ': copy the address to the clipboard',
    openMail: 'or open your mail app',
    copied: 'Address copied',
  },
  footer: {
    made: (city: string) => `Designed and built in ${city}`,
    clockBefore: 'It’s',
    clockAfter: (city: string) => `in ${city}`,
    source: 'Source code',
    top: 'Back to top',
    note: 'Music note',
    noteTip: 'I also teach music',
  },
  dashboard: {
    bar: 'Dashboard · Visualisation',
    alt: 'Dashboard chart: temperatures and humidity measured by the robot, with prediction curves',
    legend: ['Presence', 'Front T°', 'Rear T°', 'Ambient T°', 'Humidity'],
  },
  caseStudy: {
    crumb: 'Projects',
    onGithub: ' on GitHub (new tab)',
    zoom: (alt: string) => `Enlarge image: ${alt}`,
    others: 'Other projects',
    next: 'Next project',
    all: 'All projects',
    toc: 'Contents',
    closeImage: 'Close the image',
  },
};

export const UI = { fr, en } as const;
