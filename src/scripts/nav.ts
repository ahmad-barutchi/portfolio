/**
 * Navigation principale (Nav.astro) :
 * - capsule active qui glisse sous le lien courant (mesures mises en cache,
 *   recalculées au redimensionnement et quand les polices sont prêtes) ;
 * - scroll-spy sur l'accueil : la section active est la dernière dont le haut a
 *   passé 35 % de la hauteur de vue (la dernière gagne en bas de page), reflétée
 *   par aria-current="location" ; hors accueil, aria-current="page" est rendu
 *   côté serveur et la capsule s'y place ;
 * - barre masquée en défilant vers le bas, réaffichée vers le haut (jamais près
 *   du haut de page, pendant un saut d'ancre ou quand le menu est ouvert) ;
 * - menu mobile : <dialog> modal (top layer), aria-expanded synchronisé,
 *   fermeture au clic sur un lien puis navigation native vers l'ancre ;
 * - lien de langue : garde la section courante (#ancre), communes aux deux langues.
 */
const header = document.querySelector<HTMLElement>('[data-nav]');
if (header) initNav(header);

function initNav(header: HTMLElement): void {
  const track = header.querySelector<HTMLElement>('[data-nav-track]');
  const cap = header.querySelector<HTMLElement>('[data-nav-cap]');
  const pillLinks = track ? [...track.querySelectorAll<HTMLAnchorElement>('a[data-nav-id]')] : [];
  const allLinks = [...header.querySelectorAll<HTMLAnchorElement>('a[data-nav-id]')];
  const menu = header.querySelector<HTMLDialogElement>('dialog');
  const menuBtn = header.querySelector<HTMLButtonElement>('[data-menu-open]');
  const home = header.hasAttribute('data-home');
  const sections = (header.dataset.spy ?? '')
    .split(' ')
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  let active = header.dataset.current ?? '';
  let xs: number[] = [];
  let ws: number[] = [];
  let lastY = scrollY;
  let hidden = false;
  let locked = false;
  let unlockTimer = 0;
  let queued = false;

  /* Capsule : écritures seules, à partir des mesures en cache. */
  const place = (): void => {
    if (!cap) return;
    const i = pillLinks.findIndex((a) => a.dataset.navId === active);
    const w = i < 0 ? 0 : (ws[i] ?? 0);
    if (w) {
      cap.style.transform = `translateX(${xs[i]}px)`;
      cap.style.width = `${w}px`;
      if (!cap.hasAttribute('data-ready')) {
        // Première pose sans glissement ; les transitions s'activent à la frame suivante.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => cap.setAttribute('data-ready', '')),
        );
      }
    }
    cap.style.opacity = w ? '1' : '0';
  };

  const measure = (): void => {
    xs = pillLinks.map((a) => a.offsetLeft);
    ws = pillLinks.map((a) => a.offsetWidth);
    place();
  };

  const setActive = (id: string): void => {
    if (id === active) return;
    active = id;
    for (const a of allLinks) {
      if (a.dataset.navId === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
    place();
  };

  const setHidden = (h: boolean): void => {
    if (h === hidden) return;
    hidden = h;
    header.toggleAttribute('data-hidden', h);
  };

  const update = (): void => {
    queued = false;
    // Lectures d'abord…
    const y = scrollY;
    const vh = innerHeight;
    const atBottom = y + vh >= document.documentElement.scrollHeight - 4;
    let id = active;
    if (home && !locked && sections.length) {
      id = sections[0].id;
      let best = -Infinity;
      for (const s of sections) {
        const top = s.getBoundingClientRect().top;
        if (top <= vh * 0.35 && top > best) {
          best = top;
          id = s.id;
        }
      }
      if (atBottom && y > 0) id = sections[sections.length - 1].id;
    }
    // … puis écritures.
    setActive(id);
    const dy = y - lastY;
    if (y < 120 || locked || menu?.open) {
      setHidden(false);
      lastY = y;
    } else if (Math.abs(dy) > 8) {
      setHidden(dy > 0);
      lastY = y;
    }
  };

  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };

  // Clic sur un lien d'ancre de l'accueil : la capsule y va tout de suite, et le
  // scroll-spy comme le masquage se taisent tant que le défilement doux dure
  // (fin : scrollend, ou 180 ms sans défilement, ou 1 s si rien ne bouge).
  const unlock = (): void => {
    clearTimeout(unlockTimer);
    locked = false;
    queue();
  };
  const holdLock = (ms: number): void => {
    clearTimeout(unlockTimer);
    unlockTimer = window.setTimeout(unlock, ms);
  };

  addEventListener(
    'scroll',
    () => {
      if (locked) holdLock(180);
      queue();
    },
    { passive: true },
  );
  addEventListener('resize', queue, { passive: true });
  addEventListener('scrollend', () => {
    if (locked) unlock();
  });

  header.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-nav-id]');
    if (!home || !a?.dataset.navId) return;
    locked = true;
    holdLock(1000);
    setActive(a.dataset.navId);
    setHidden(false);
  });

  if (track && 'ResizeObserver' in window) new ResizeObserver(measure).observe(track);
  else measure();
  document.fonts?.ready.then(measure);
  update();

  /* Menu mobile */
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', () => {
      menu.showModal();
      menuBtn.setAttribute('aria-expanded', 'true');
    });
    menu.addEventListener('close', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      // Le navigateur rend le focus au bouton ; filet de sécurité sinon.
      if (!document.activeElement || document.activeElement === document.body) {
        menuBtn.focus({ preventScroll: true });
      }
    });
    // Lien ou bouton fermer : on ferme d'abord, la navigation native suit.
    menu.addEventListener('click', (e) => {
      if ((e.target as Element | null)?.closest('a, [data-menu-close]')) menu.close();
    });
    matchMedia('(min-width: 821px)').addEventListener('change', (e) => {
      if (e.matches && menu.open) menu.close();
    });
  }

  /* Changement de langue : on reste sur la même section. */
  for (const a of header.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]')) {
    a.addEventListener('click', () => {
      if (home && location.hash) a.hash = location.hash;
    });
  }
}
