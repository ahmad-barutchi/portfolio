// Génère public/og.png (1200×630) et public/apple-touch-icon.png (180×180) avec Playwright.
// Usage : npm run og   (nécessite Chromium : npx playwright install chromium)
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const font = (p) =>
  `data:font/woff2;base64,${fs.readFileSync(new URL(`../node_modules/${p}`, import.meta.url)).toString('base64')}`;
const GEIST = font('@fontsource-variable/geist/files/geist-latin-wght-normal.woff2');
const MONO = font('@fontsource/geist-mono/files/geist-mono-latin-500-normal.woff2');

const css = `
  @font-face { font-family: Geist; src: url(${GEIST}) format('woff2'); font-weight: 100 900; }
  @font-face { font-family: 'Geist Mono'; src: url(${MONO}) format('woff2'); font-weight: 500; }
  html, body { margin: 0; }
  body { background: #0b0d14; color: #f3efe6; font-family: Geist, sans-serif; }
  .dots { position: absolute; inset: 0;
    background: radial-gradient(circle, rgb(150 157 178 / .32) 1.2px, transparent 1.6px) 0 0 / 28px 28px;
    -webkit-mask-image: radial-gradient(120% 90% at 20% 30%, #000 30%, transparent 85%); }
  .halo { position: absolute; inset: 0;
    background: radial-gradient(40% 60% at 15% 85%, rgb(255 180 84 / .16), transparent 70%),
                radial-gradient(45% 55% at 85% 15%, rgb(90 110 200 / .16), transparent 70%); }
  .beacon { display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ffb454;
    box-shadow: 0 0 0 7px rgb(255 180 84 / .18), 0 0 22px #ffb454; }
  .mono { font-family: 'Geist Mono', monospace; font-weight: 500; text-transform: uppercase; letter-spacing: .12em; }
`;

const og = `<!doctype html><html><head><style>${css}
  .card { position: relative; width: 1200px; height: 630px; overflow: hidden; }
  .content { position: absolute; left: 88px; right: 88px; bottom: 84px; }
  .status { display: flex; align-items: center; gap: 18px; font-size: 20px; color: #f3efe6; margin-bottom: 40px; }
  h1 { margin: 0; font-size: 128px; line-height: .88; font-weight: 600; letter-spacing: -.055em; }
  h1 span { color: #ffb454; }
  .rule { height: 1px; background: rgb(243 239 230 / .17); margin: 44px 0 26px; }
  .sub { display: flex; justify-content: space-between; font-size: 22px; color: #aeb2c0; }
</style></head><body><div class="card">
  <div class="halo"></div><div class="dots"></div>
  <div class="content">
    <div class="status mono"><span class="beacon"></span>En poste à l’INASEP</div>
    <h1>Ahmad<br>Barutchi<span>.</span></h1>
    <div class="rule"></div>
    <div class="sub mono"><span>Informaticien industriel · Namur</span><span>abarutchi.web.app</span></div>
  </div>
</div></body></html>`;

const icon = `<!doctype html><html><head><style>${css}
  .icon { position: relative; width: 180px; height: 180px; display: grid; place-items: center; overflow: hidden; }
  .ring { position: absolute; width: 112px; height: 112px; border-radius: 50%;
    border: 7px solid rgb(255 180 84 / .6); border-left-color: transparent; transform: rotate(45deg); }
  .core { width: 56px; height: 56px; border-radius: 50%; background: #ffb454; box-shadow: 0 0 30px rgb(255 180 84 / .7); }
</style></head><body><div class="icon"><div class="ring"></div><div class="core"></div></div></body></html>`;

const browser = await chromium.launch();
const shoot = async (htmlDoc, width, height, out) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(htmlDoc, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out });
  await page.close();
  console.log(`✓ ${out}`);
};
await shoot(og, 1200, 630, 'public/og.png');
await shoot(icon, 180, 180, 'public/apple-touch-icon.png');
await browser.close();
