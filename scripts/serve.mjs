// Serveur statique minimal qui imite Firebase Hosting (cleanUrls, 404.html, cache).
// Usage : node scripts/serve.mjs [port] [dossier]   (par défaut 4321 et dist)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.argv[2] ?? process.env.PORT ?? 4321);
const root = path.resolve(process.argv[3] ?? 'dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

const isFile = (p) => p.startsWith(root) && fs.existsSync(p) && fs.statSync(p).isFile();

http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    // trailingSlash: false → /x/ redirige vers /x
    if (pathname.length > 1 && pathname.endsWith('/')) {
      res.writeHead(301, { location: pathname.slice(0, -1) });
      res.end();
      return;
    }
    const base = path.join(root, pathname);
    const file = [base, `${base}.html`, path.join(base, 'index.html')].find(isFile);
    if (!file) {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      res.end(fs.readFileSync(path.join(root, '404.html')));
      return;
    }
    const immutable = pathname.startsWith('/_astro/');
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port} (${root})`));
