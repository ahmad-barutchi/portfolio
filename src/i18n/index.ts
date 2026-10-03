/**
 * Langues du site : français par défaut (à la racine), anglais sous /en.
 * La langue d'une page se déduit de son URL ; chaque composant appelle
 * useI18n(Astro) pour obtenir le contenu et les libellés de sa langue.
 */
import * as siteFr from '../data/site';
import * as siteEn from '../data/site.en';
import * as caseFr from '../data/case-robot';
import * as caseEn from '../data/case-robot.en';
import { UI } from './ui';

export type Lang = 'fr' | 'en';
export const LANGS: readonly Lang[] = ['fr', 'en'];

/** Langue d'une page d'après son chemin (/en, /en/…, /en.html). */
export function langOf(pathname: string): Lang {
  return /^\/en(?:\/|\.html$|$)/.test(pathname) ? 'en' : 'fr';
}

const CONTENT = { fr: siteFr, en: siteEn as typeof siteFr };
const CASES = { fr: caseFr, en: caseEn as typeof caseFr };

/** Accueil de chaque langue. */
export const HOME: Record<Lang, string> = { fr: '/', en: '/en' };

/** Pages qui existent dans les deux langues (chemins sans extension). */
const PAGES: ReadonlyArray<Record<Lang, string>> = [
  HOME,
  { fr: siteFr.FEATURED_PROJECT.href, en: siteEn.FEATURED_PROJECT.href },
];

const normalize = (path: string) => path.replace(/\.html$/, '').replace(/(.)\/$/, '$1') || '/';

/** Équivalents d'une page dans chaque langue, ou undefined si elle n'existe que dans une. */
export function alternates(pathname: string): Record<Lang, string> | undefined {
  const path = normalize(pathname === '/index.html' ? '/' : pathname);
  return PAGES.find((p) => p.fr === path || p.en === path);
}

export function useI18n(astro: { url: URL }) {
  const lang = langOf(astro.url.pathname);
  const other: Lang = lang === 'fr' ? 'en' : 'fr';
  return {
    lang,
    other,
    c: CONTENT[lang],
    cs: CASES[lang],
    t: UI[lang],
    home: HOME[lang],
    /** Lien vers une section de l'accueil : ancre locale sur l'accueil, sinon /#id ou /en#id. */
    section: (id: string, onHome: boolean) => (onHome ? `#${id}` : `${HOME[lang]}#${id}`),
  };
}
