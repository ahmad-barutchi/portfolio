/**
 * Site content in English: same shape as site.ts (each export is typed with
 * its French counterpart, so a missing field fails the type check).
 * Non-translatable data (links, coordinates, stacks) is reused from site.ts.
 */
import * as fr from './site';

export { splitEmphasis } from './site';

export const SITE: typeof fr.SITE = {
  ...fr.SITE,
  title: 'Ahmad Barutchi — Industrial IT specialist and full-stack developer in Namur',
  description:
    'Industrial IT specialist and project manager at INASEP, full-stack developer (Python, Odoo, Angular) based in Namur, Belgium. Background, projects including an IoT rescue robot, and contact.',
};

export const PROFILE: typeof fr.PROFILE = {
  ...fr.PROFILE,
  role: 'Industrial IT specialist · project manager',
  availabilityLabel: {
    open: 'Open to opportunities',
    busy: 'Working at INASEP',
  },
  country: 'Belgium',
  languages: [
    { code: 'FR', name: 'French' },
    { code: 'EN', name: 'English' },
    { code: 'AR', name: 'Arabic' },
  ],
  drivingLicense: 'B, since 2014',
};

export const NAV: typeof fr.NAV = [
  { id: 'accueil', label: 'Home' },
  { id: 'a-propos', label: 'About' },
  { id: 'parcours', label: 'Journey' },
  { id: 'projets', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const SECTIONS: typeof fr.SECTIONS = {
  'a-propos': {
    index: '01',
    label: 'About',
    title: 'Three languages, two keyboards, *one score*.',
  },
  parcours: { index: '02', label: 'Journey', title: 'Experience that *counts*.' },
  projets: { index: '03', label: 'Projects', title: 'Things I’ve *built*.' },
  competences: { index: '04', label: 'Skills', title: 'A *connected* toolbox.' },
  contact: { index: '05', label: 'Contact', title: 'Let’s work *together*.' },
};

export const HERO: typeof fr.HERO = {
  ledeStrong: '*Industrial* IT specialist and project manager in Namur.',
  ledeRest: 'Full-stack developer: Python, Odoo and Angular, from sensor to dashboard.',
  primaryCta: { label: 'See the projects', href: '#projets' },
  secondaryCta: { label: 'CV · PDF' },
};

export const ABOUT: typeof fr.ABOUT = {
  lead: 'Since March 2026, I’ve been an <em>industrial</em> IT specialist and remote-monitoring project manager at INASEP, in Namur. Before that, I spent a year at BHC building Odoo modules in Python and JavaScript, after two web internships and a bachelor’s degree in Computer Science and Systems at HEH, in Mons.',
  paragraphs: [
    'My path started elsewhere: medical equipment engineering studies in Aleppo, two years volunteering with the Red Crescent, then arriving in Belgium. There I learned French from A1 to B2 in a year, and took a detour through an art school in Ghent before choosing code.',
    'My final-year project was a rescue robot that streams its telemetry to a web and mobile dashboard. Since 2016, I’ve also been giving private lessons in computing and music.',
  ],
  facts: [
    { label: 'Languages', value: 'Trilingual · FR · EN · AR' },
    { label: 'Licence', value: 'B, since 2014' },
    { label: 'Based in', value: 'Namur, Belgium' },
    { label: 'Teaches', value: 'Computing and music' },
  ],
  portraitAlt: 'Portrait of Ahmad Barutchi, smiling, in a white shirt',
};

const [inasep, bhc, cetic, acea, cedraie, apprentus, redCrescent] = fr.EXPERIENCES;

export const EXPERIENCES: typeof fr.EXPERIENCES = [
  {
    ...inasep,
    role: 'Industrial IT specialist, project manager',
    place: 'Namur, Belgium',
    period: 'Since March 2026',
    description: 'Industrial IT and remote-monitoring project management.',
    badge: 'Current role',
  },
  {
    ...bhc,
    place: 'Mons, Belgium',
    description: 'Odoo development in Python and JavaScript.',
  },
  {
    ...cetic,
    role: 'Web developer intern',
    mode: 'hybrid',
    period: 'Feb – May 2022',
    description: 'Built a monitoring web application in Angular.',
  },
  {
    ...acea,
    role: 'Developer intern',
    place: 'Brussels',
    mode: 'remote',
    period: 'Feb – May 2021',
    description: 'Built a web service application in WinDev and Python.',
  },
  {
    ...cedraie,
    role: 'Student job',
    place: 'Mons, Belgium',
    period: 'June – Dec 2019',
    description: 'Fast food.',
  },
  {
    ...apprentus,
    role: 'Private tutor',
    place: 'Belgium',
    period: 'Since August 2016',
    description: 'Computing and music lessons, at home and online.',
  },
  {
    ...redCrescent,
    role: 'Volunteer',
    org: 'Red Crescent',
    place: 'Aleppo, Syria',
    description:
      'Food parcel distribution, emotional support for children with cancer, first aider.',
  },
];

const [heh, promSoc, kask, aic4t, aleppo] = fr.EDUCATION;

export const EDUCATION: typeof fr.EDUCATION = [
  {
    ...heh,
    place: 'Mons, Belgium',
    title:
      'Bachelor’s in Computer Science and Systems, Networks and Telecommunications track, development option.',
  },
  {
    ...promSoc,
    school: 'Promotion sociale de Mons (adult education)',
    place: 'Mons, Belgium',
    title: 'French language courses, levels A1 to B2.',
  },
  {
    ...kask,
    period: 'May – June 2016',
    place: 'Ghent, Belgium',
    title: 'Open Design Course, art training.',
  },
  {
    ...aic4t,
    period: 'June – Sept 2015',
    place: 'Aleppo, Syria',
    title: 'Professional trainer.',
  },
  {
    ...aleppo,
    school: 'University of Aleppo',
    place: 'Aleppo, Syria',
    title: 'Diploma in medical equipment engineering technology.',
  },
];

export const FEATURED_PROJECT: typeof fr.FEATURED_PROJECT = {
  ...fr.FEATURED_PROJECT,
  slug: 'rescue-robot',
  href: '/en/projects/rescue-robot',
  meta: 'Final project 2022 · Duo · IoT',
  badge: 'Case study',
  titleStart: 'Rescue',
  titleEm: 'robot',
  title: 'Prototyping a rescue robot',
  summary:
    'A prototype that detects a human presence or a fire source, and sends its telemetry to a web and Android dashboard.',
};

const [deepvision, sdg, portfolio] = fr.PROJECT_TILES;

export const PROJECT_TILES: typeof fr.PROJECT_TILES = [
  {
    ...deepvision,
    meta: 'Hackathon · Feb 2023',
    sub: 'CSLabs · Disability, UNamur',
    description:
      'Web and Android app that sends the camera feed to a Flask API: MediaPipe detects a human presence, announced by speech synthesis. Team of six.',
  },
  {
    ...sdg,
    sub: 'BeCentral, Brussels',
    description:
      'Prototype around the European Your Europe portal: React app, ASP.NET web API in C# and a SQL database.',
  },
  {
    ...portfolio,
    meta: 'This site · v2 · 2026',
    description:
      'Designed and built from scratch: static HTML, native CSS, a few kilobytes of JavaScript.',
  },
];

export const RADAR: typeof fr.RADAR = {
  kicker: 'Base',
  caption: 'Where I’ve worked, studied and joined hackathons.',
};

const PLACE_NAMES: Record<string, string> = { BXL: 'Brussels', GND: 'Ghent' };

export const RADAR_PLACES: typeof fr.RADAR_PLACES = fr.RADAR_PLACES.map((p) => ({
  ...p,
  name: PLACE_NAMES[p.code] ?? p.name,
}));

const MONTHS: Record<string, string> = { Fév: 'Feb', Avr: 'Apr' };
const HACKATHON_NAMES: Record<string, string> = { 'CSLabs · Le Handicap': 'CSLabs · Disability' };

export const HACKATHONS: typeof fr.HACKATHONS = fr.HACKATHONS.map((h) => ({
  ...h,
  date: h.date.replace(/^\S+/, (m) => MONTHS[m] ?? m),
  name: HACKATHON_NAMES[h.name] ?? h.name,
  place: h.place.replace('Bruxelles', 'Brussels'),
  link: h.link && { ...h.link, label: h.link.label.replace(' sur GitHub', ' on GitHub') },
}));

export const SKILLS_PROFILE: typeof fr.SKILLS_PROFILE =
  'Industrial IT specialist and full-stack developer: front-end, back-end, mobile (Android) and web applications.';

const GROUP_LABELS: Record<string, string> = { langages: 'Languages', outils: 'Tools' };
const SKILL_LABELS: Record<string, string> = {
  poo: 'Object-oriented programming',
  algo: 'Algorithms',
  rest: 'REST API',
};

export const SKILL_GROUPS: typeof fr.SKILL_GROUPS = fr.SKILL_GROUPS.map((g) => ({
  ...g,
  label: GROUP_LABELS[g.id] ?? g.label,
  items: g.items.map((s) => ({ ...s, label: SKILL_LABELS[s.id] ?? s.label })),
}));

export const CONTACT: typeof fr.CONTACT = {
  ...fr.CONTACT,
  intro: 'A project, a collaboration or a question: drop me a line.',
};
