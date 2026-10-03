#!/usr/bin/env node
/**
 * Rapatrie les captures du TFE « Robot secouriste » depuis imgur
 * (HANDOVER.md, annexe A) vers src/assets/projects/robot-secouriste/.
 *
 *   npm run fetch:images
 *
 * - Node 22, aucune dépendance (fetch natif).
 * - Ignore les images déjà présentes (quelle que soit leur extension).
 * - Délai maximal de 15 s par image ; une erreur n'arrête pas les suivantes.
 * - Le format réel est détecté (PNG, JPEG, WebP) et l'extension choisie en conséquence.
 * - Résumé final ; code de sortie 0 dans tous les cas (le site se construit sans
 *   ces images : les figures absentes ne sont simplement pas rendues).
 * Derrière un proxy HTTP(S) : NODE_USE_ENV_PROXY=1 npm run fetch:images (Node ≥ 22.21).
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(ROOT, 'src/assets/projects/robot-secouriste');
const TIMEOUT_MS = 15_000;

/** Nom cible (sans extension) → identifiant imgur. */
const IMAGES = [
  ['graphe-predictions', 'DbPLA27.png'],
  ['login', '3GJAfyn.png'],
  ['admin-hash', '96GXP5M.png'],
  ['tableau-detections', 'FVy2Jz7.png'],
  ['seances', 'hJnMUAJ.png'],
  ['jwt', 'NvnJufF.png'],
  ['swagger-routes', 'UsNfTMB.png'],
  ['swagger-login', 'Ijt8tmP.png'],
  ['android-1', 'zFGTGOa.png'],
  ['android-2', 'iBNJ47Y.png'],
  ['android-3', 'YqBqYde.png'],
  ['schema-electrique', 'KNOxrqa.png'],
];

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'avif'];

/** Extension d'après la signature du fichier, ou null si ce n'est pas une image gérée. */
function sniff(bytes) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return 'png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  const riff = String.fromCharCode(...bytes.subarray(0, 4));
  const webp = String.fromCharCode(...bytes.subarray(8, 12));
  if (riff === 'RIFF' && webp === 'WEBP') return 'webp';
  return null;
}

/** Message lisible pour une erreur de fetch (la cause réseau est souvent dans `cause`). */
function describe(error) {
  if (error?.name === 'TimeoutError') return `délai de ${TIMEOUT_MS / 1000} s dépassé`;
  const cause = error?.cause;
  const detail = cause?.code || cause?.message;
  return detail ? `${error.message} (${detail})` : String(error?.message ?? error);
}

async function download(name, id) {
  const url = `https://i.imgur.com/${id}`;
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': 'abarutchi-portfolio/fetch-tfe-images' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
  // imgur redirige les images supprimées vers une vignette « removed ».
  if (/\/removed\.(png|jpg)$/.test(new URL(response.url).pathname)) {
    throw new Error('image supprimée sur imgur');
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) {
    throw new Error(
      `contenu inattendu (${response.headers.get('content-type') ?? 'type inconnu'})`,
    );
  }
  const file = join(DEST, `${name}.${ext}`);
  await writeFile(file, bytes);
  return { file, size: bytes.length };
}

await mkdir(DEST, { recursive: true });
const present = new Set(
  (await readdir(DEST))
    .filter((f) => EXTENSIONS.includes(f.split('.').pop()?.toLowerCase() ?? ''))
    .map((f) => f.replace(/\.[^.]+$/, '')),
);

const summary = { downloaded: [], skipped: [], failed: [] };
console.log(`Captures du TFE → ${DEST.replace(ROOT + '/', '')}\n`);

for (const [name, id] of IMAGES) {
  if (present.has(name)) {
    summary.skipped.push(name);
    console.log(`  ·  ${name} : déjà présente`);
    continue;
  }
  try {
    const { size } = await download(name, id);
    summary.downloaded.push(name);
    console.log(`  ✓  ${name} : ${(size / 1024).toFixed(0)} Ko`);
  } catch (error) {
    summary.failed.push(name);
    console.log(`  ✗  ${name} : ${describe(error)}`);
  }
}

console.log(
  `\n${summary.downloaded.length} téléchargée(s), ${summary.skipped.length} déjà présente(s), ` +
    `${summary.failed.length} en échec sur ${IMAGES.length}.`,
);
if (summary.failed.length) {
  console.log(
    'Les figures manquantes ne sont pas rendues. Relancer plus tard, ou déposer les fichiers ' +
      'à la main (mêmes noms, PNG ou JPEG) dans le dossier ci-dessus.',
  );
}
process.exitCode = 0;
