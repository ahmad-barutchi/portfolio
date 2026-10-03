/**
 * Bouton magnétique (HANDOVER 6.3) : quand le pointeur passe à moins de 60 px
 * du bouton, celui-ci glisse vers lui de 25 % de l'écart à son centre (propriété
 * CSS translate ; la transition de 160 ms est dans le style du composant).
 * L'effet s'estompe linéairement vers le bord de la zone, pour ne jamais sauter.
 * Seulement pour un pointeur fin et hors prefers-reduced-motion.
 *
 * `zone` reçoit les pointermove : un ancêtre qui couvre la zone d'attraction.
 */
const RADIUS = 60;
const PULL = 0.25;

export function magnetize(el: HTMLElement, zone: HTMLElement): void {
  if (
    !matchMedia('(pointer: fine)').matches ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }
  const move = (dx: number, dy: number): void => {
    el.style.translate = dx || dy ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : '';
  };

  zone.addEventListener(
    'pointermove',
    (e) => {
      const parent = el.offsetParent;
      if (e.pointerType === 'touch' || !parent) return;
      // Lectures d'abord : la géométrie hors transformations (offset*) évite
      // que le déplacement du bouton ne modifie sa propre mesure.
      const b = parent.getBoundingClientRect();
      const hw = el.offsetWidth / 2;
      const hh = el.offsetHeight / 2;
      const dx = e.clientX - (b.left + parent.clientLeft + el.offsetLeft + hw);
      const dy = e.clientY - (b.top + parent.clientTop + el.offsetTop + hh);
      // Distance au bord du bouton (0 à l'intérieur).
      const ex = Math.max(Math.abs(dx) - hw, 0);
      const ey = Math.max(Math.abs(dy) - hh, 0);
      const d = Math.sqrt(ex * ex + ey * ey);
      const f = d < RADIUS ? PULL * (1 - d / RADIUS) : 0;
      // Écriture ensuite.
      move(dx * f, dy * f);
    },
    { passive: true },
  );
  zone.addEventListener('pointerleave', () => move(0, 0));
}
