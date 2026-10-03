import type { ImageMetadata } from 'astro';

/**
 * Captures de l'étude de cas « Robot secouriste ».
 * Elles sont hébergées sur imgur ; `npm run fetch:images` les télécharge dans
 * src/assets/projects/robot-secouriste/. Tant qu'un fichier manque, la figure
 * correspondante n'est pas rendue (et la couverture retombe sur l'illustration).
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/projects/robot-secouriste/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

const byName = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const base = path
    .split('/')
    .pop()!
    .replace(/\.[^.]+$/, '');
  byName.set(base, mod.default);
}

/** Renvoie l'image `name` (sans extension) si elle est présente dans le dépôt. */
export function caseImage(name: string): ImageMetadata | undefined {
  return byName.get(name);
}

/** Couverture du projet : le graphe du tableau de bord. */
export const COVER_NAME = 'graphe-predictions';
