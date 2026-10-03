/**
 * Bascule du thème (boutons [data-theme-toggle]).
 * Contrat : écrit localStorage 'theme', pose <html data-theme>, met à jour les
 * <meta name="theme-color">, puis émet document « themechange » ({ theme }).
 * Si le navigateur sait faire une transition de vue (et hors reduced-motion),
 * le nouveau thème s'ouvre en cercle depuis le bouton ; les styles associés
 * (:root[data-theme-switch]) sont dans Nav.astro.
 * Le thème initial est posé avant le rendu par le script inline de Base.astro.
 */
type Theme = 'dark' | 'light';
type Transition = { ready: Promise<void>; finished: Promise<void> };

const root = document.documentElement;
const COLOR: Record<Theme, string> = { dark: '#0b0d14', light: '#f7f4ee' };
const LABEL: Record<Theme, string> = {
  dark: 'Passer au thème clair',
  light: 'Passer au thème sombre',
};
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const systemLight = matchMedia('(prefers-color-scheme: light)');

const current = (): Theme => (root.dataset.theme === 'light' ? 'light' : 'dark');

function stored(): Theme | null {
  try {
    const t = localStorage.getItem('theme');
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null;
  }
}

/** Reflète le thème dans l'interface : libellés des boutons et couleur du navigateur. */
function sync(theme: Theme): void {
  for (const m of document.querySelectorAll('meta[name="theme-color"]')) {
    m.setAttribute('content', COLOR[theme]);
  }
  for (const b of document.querySelectorAll('[data-theme-toggle]')) {
    b.setAttribute('aria-label', LABEL[theme]);
  }
}

function apply(theme: Theme, persist: boolean): void {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* stockage indisponible : le choix vaut pour cette page */
    }
  }
  sync(theme);
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

function toggle(button: Element): void {
  const next: Theme = current() === 'dark' ? 'light' : 'dark';
  const doc = document as Document & { startViewTransition?: (cb: () => void) => Transition };
  if (!doc.startViewTransition || reduce.matches) {
    apply(next, true);
    return;
  }
  // Lecture de la géométrie avant toute écriture.
  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.setAttribute('data-theme-switch', '');
  const vt = doc.startViewTransition(() => apply(next, true));
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => root.removeAttribute('data-theme-switch'));
}

sync(current());

document.addEventListener('click', (e) => {
  const button = (e.target as Element | null)?.closest?.('[data-theme-toggle]');
  if (button) toggle(button);
});

// Sans choix mémorisé, suivre la préférence système si elle change.
systemLight.addEventListener('change', (e) => {
  if (!stored()) apply(e.matches ? 'light' : 'dark', false);
});

// Retour arrière depuis le cache (bfcache) : rattraper un choix fait sur une autre page.
addEventListener('pageshow', (e) => {
  const t = stored();
  if (e.persisted && t && t !== current()) apply(t, false);
});
