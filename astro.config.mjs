// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Polices auto-hébergées depuis les paquets Fontsource (sous-ensemble latin uniquement).
// L'API Fonts d'Astro génère les @font-face, les liens de préchargement et des polices
// de secours aux métriques ajustées (pas de saut de mise en page au chargement).
export default defineConfig({
  site: 'https://abarutchi.web.app',
  trailingSlash: 'never',
  build: {
    // /projets/robot-secouriste.html, servi sur /projets/robot-secouriste par Firebase (cleanUrls).
    format: 'file',
  },
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-geist',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            src: ['@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2'],
            weight: '500',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument',
      fallbacks: ['serif'],
      options: {
        variants: [
          {
            src: ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2'],
            weight: '400',
            style: 'italic',
          },
        ],
      },
    },
  ],
});
