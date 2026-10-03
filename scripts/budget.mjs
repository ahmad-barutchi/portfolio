// Budgets de poids (HANDOVER 8.1), mesurés en gzip sur dist/.
// JS : fichiers + scripts inline. CSS : fichiers + styles inline. Code de sortie 1 si dépassement.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = path.resolve('dist');
const LIMITS = { jsTotal: 15, jsPage: 8, cssTotal: 20, fonts: 100, homeInitial: 250 }; // KB
const gz = (buf) => zlib.gzipSync(buf, { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(1);

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const sizeOf = new Map(files.map((f) => [f, gz(fs.readFileSync(f))]));
const assetPath = (url) => path.join(DIST, url.split('?')[0]);

const jsFiles = files.filter((f) => f.endsWith('.js'));
const cssFiles = files.filter((f) => f.endsWith('.css'));
const fontFiles = files.filter((f) => f.endsWith('.woff2'));

let inlineJsAll = 0;
let inlineCssAll = 0;
const pages = html.map((file) => {
  const src = fs.readFileSync(file, 'utf8');
  const scripts = [...src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
  let js = 0;
  for (const [, attrs, body] of scripts) {
    if (/type="application\/ld\+json"/.test(attrs)) continue;
    const ext = attrs.match(/src="([^"]+)"/);
    if (ext) js += sizeOf.get(assetPath(ext[1])) ?? 0;
    else if (body.trim()) {
      const n = gz(Buffer.from(body));
      js += n;
      inlineJsAll += n;
    }
  }
  let css = 0;
  for (const [, href] of src.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
    css += sizeOf.get(assetPath(href)) ?? 0;
  }
  for (const [, body] of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    const n = gz(Buffer.from(body));
    css += n;
    inlineCssAll += n;
  }
  const fonts = sum(
    [...src.matchAll(/<link[^>]+rel="preload"[^>]+href="([^"]+\.woff2)"/g)].map(
      ([, href]) => sizeOf.get(assetPath(href)) ?? 0,
    ),
  );
  return { page: '/' + path.relative(DIST, file), html: gz(Buffer.from(src)), js, css, fonts };
});

const jsTotal = sum(jsFiles.map((f) => sizeOf.get(f))) + inlineJsAll;
const cssTotal = sum(cssFiles.map((f) => sizeOf.get(f))) + inlineCssAll;
const fontsTotal = sum(fontFiles.map((f) => fs.statSync(f).size));
const home = pages.find((p) => p.page === '/index.html');
const homeInitial = home ? home.html + home.js + home.css + home.fonts : 0;

console.log('\nPage                                   HTML    JS     CSS    polices (KB gzip)');
for (const p of pages) {
  console.log(
    `${p.page.padEnd(38)} ${kb(p.html).padStart(5)}  ${kb(p.js).padStart(5)}  ${kb(p.css).padStart(5)}  ${kb(p.fonts).padStart(6)}`,
  );
}

const checks = [
  ['JS total (gzip)', jsTotal, LIMITS.jsTotal],
  ['JS max par page (gzip)', Math.max(...pages.map((p) => p.js)), LIMITS.jsPage],
  ['CSS total (gzip)', cssTotal, LIMITS.cssTotal],
  ['Polices (woff2)', fontsTotal, LIMITS.fonts],
  ['Poids initial de / (HTML+CSS+JS+polices préchargées)', homeInitial, LIMITS.homeInitial],
];
let failed = false;
console.log('\nBudget                                               mesuré   limite');
for (const [label, value, limit] of checks) {
  const ok = value <= limit * 1024;
  failed ||= !ok;
  console.log(
    `${ok ? '✓' : '✗'} ${label.padEnd(52)} ${kb(value).padStart(6)}  ${String(limit).padStart(6)}`,
  );
}
console.log(failed ? '\nBudget dépassé.' : '\nTous les budgets sont respectés.');
process.exit(failed ? 1 : 0);
