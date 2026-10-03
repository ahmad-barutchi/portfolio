import { test, expect, type Page } from '@playwright/test';

const PAGES = ['/', '/projets/robot-secouriste', '/404'];

/** Charge une page en collectant erreurs console et requêtes vers un autre domaine. */
async function load(page: Page, url: string) {
  const problems: string[] = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['127.0.0.1', 'localhost'].includes(u.hostname) && u.protocol !== 'data:') {
      problems.push(`requête externe: ${r.url()}`);
    }
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  return problems;
}

for (const url of PAGES) {
  test(`${url} : sans erreur, sans requête externe, un seul h1`, async ({ page }) => {
    const problems = await load(page, url);
    expect(problems).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test(`${url} : images avec alt, liens externes en noopener`, async ({ page }) => {
    await page.goto(url);
    expect(await page.locator('img:not([alt])').count()).toBe(0);
    expect(await page.locator('a[target="_blank"]:not([rel~="noopener"])').count()).toBe(0);
  });

  test(`${url} : pas de défilement horizontal à 375 px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test('accueil : toutes les sections existent', async ({ page }) => {
  await page.goto('/');
  for (const id of ['accueil', 'a-propos', 'parcours', 'projets', 'competences', 'contact']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  for (const href of ['#accueil', '#a-propos', '#parcours', '#projets', '#contact']) {
    await expect(page.locator(`nav a[href="${href}"]`).first()).toBeAttached();
  }
});

test('thème : la bascule change data-theme et persiste au rechargement', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.locator('[data-theme-toggle]').first().click();
  const after = before === 'dark' ? 'light' : 'dark';
  await expect(html).toHaveAttribute('data-theme', after);
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', after);
});

test('menu mobile : s’ouvre et se ferme avec Échap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const open = page.locator('[data-menu-open]').first();
  await open.click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
});

test('étude de cas : accessible depuis la tuile vedette', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[href="/projets/robot-secouriste"]').first().click();
  await expect(page).toHaveURL(/\/projets\/robot-secouriste$/);
  await expect(page.locator('h1')).toContainText('robot');
});

test('une URL inconnue renvoie la page 404', async ({ page }) => {
  const response = await page.goto('/cette-page-n-existe-pas');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('404');
});

test('reduced-motion : le champ de points du hero reste immobile', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  const canvas = page.locator('#accueil canvas').first();
  await expect(canvas).toBeVisible();
  const first = await canvas.screenshot();
  await page.waitForTimeout(1200);
  const second = await canvas.screenshot();
  expect(Buffer.compare(first, second)).toBe(0);
  await context.close();
});
