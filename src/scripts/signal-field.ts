/**
 * Champ de signal : grille de points vivante derrière le hero (et la 404).
 * Port de la maquette SIGNAL (Main.dc.html, classe DCLogic : _setup, _step,
 * _draw, _palette), sans framework.
 *
 * - Effet loupe : autour du pointeur (rayon 190 px), les points s'écartent
 *   (≤ 10 px), grossissent et s'allument en accent selon la proximité.
 * - Onde radar toutes les 5,2 à 7,6 s : traînée qui s'éteint, anneau pâle.
 * - Respiration lente de l'alpha des points éteints.
 * - rAF seulement si l'hôte est visible et l'onglet actif ; aucune allocation
 *   par frame (Float32Array) ; densité de pixels plafonnée à 2.
 * - Couleurs lues dans --dot-rgb, --dot-alpha et --accent-rgb, relues à chaque
 *   événement « themechange ».
 * - prefers-reduced-motion : un seul rendu statique, aucune boucle.
 */

export interface SignalFieldOptions {
  /** Réagit au pointeur (souris, stylet). Par défaut : true. */
  interactive?: boolean;
}

const RADIUS = 190;
const BAND = 30;

export function initSignalField(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  opts: SignalFieldOptions = {},
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const doc = document;
  const now = (): number => performance.now();
  const { random, sqrt } = Math;
  let w = 0;
  let h = 0;
  let n = 0;
  // Origine, position courante, rayon, allumage pointeur, allumage onde, phase.
  let ox!: Float32Array, oy!: Float32Array, x!: Float32Array, y!: Float32Array;
  let r!: Float32Array, a!: Float32Array, wv!: Float32Array, ph!: Float32Array;

  let px = 0;
  let py = 0;
  let on = false;
  // Onde : origine, départ (-1 : aucune), rayon et amplitude courants.
  let wx = 0;
  let wy = 0;
  let w0 = -1;
  let wr = -1;
  let amp = 0;
  let next = now() + 900;

  let dot = '';
  let acc = '';
  let base = 0.3;
  let raf = 0;
  let inView = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const palette = (): void => {
    const s = getComputedStyle(doc.documentElement);
    const v = (k: string): string => s.getPropertyValue(k);
    dot = `rgb(${v('--dot-rgb')})`;
    acc = `rgb(${v('--accent-rgb')})`;
    base = +v('--dot-alpha') || 0.3;
  };

  const step = (t: number): void => {
    if (t > next) {
      wx = w * (0.12 + random() * 0.76);
      wy = h * (0.12 + random() * 0.56);
      w0 = t;
      next = t + 5200 + random() * 2400;
    }
    wr = -1;
    amp = 0;
    if (w0 >= 0) {
      wr = (t - w0) * 0.55;
      amp = 1 - wr / (sqrt(w * w + h * h) * 0.95);
      if (amp <= 0) {
        w0 = wr = -1;
        amp = 0;
      }
    }
    for (let i = 0; i < n; i++) {
      let tx = ox[i];
      let ty = oy[i];
      let tr = 1;
      let ta = 0;
      if (on) {
        const dx = ox[i] - px;
        const dy = oy[i] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < RADIUS * RADIUS) {
          const d = sqrt(d2) || 1;
          const k = 1 - d / RADIUS;
          const e = 10 * k * k;
          tx += (dx / d) * e;
          ty += (dy / d) * e;
          tr = 1 + 1.8 * k;
          ta = k ** 1.4;
        }
      }
      if (wr > 0) {
        const dx = ox[i] - wx;
        const dy = oy[i] - wy;
        const off = Math.abs(sqrt(dx * dx + dy * dy) - wr);
        if (off < BAND) {
          const hit = (1 - off / BAND) * amp;
          if (hit > wv[i]) wv[i] = hit;
        }
      }
      wv[i] *= 0.955;
      x[i] += (tx - x[i]) * 0.12;
      y[i] += (ty - y[i]) * 0.12;
      r[i] += (Math.max(tr, 1 + wv[i] * 1.2) - r[i]) * 0.14;
      a[i] += (ta - a[i]) * 0.12;
    }
  };

  const draw = (t: number): void => {
    ctx.clearRect(0, 0, w, h);
    // Passe 1 : points éteints, gris dédié, respiration.
    ctx.fillStyle = dot;
    for (let i = 0; i < n; i++) {
      const lit = a[i] > wv[i] ? a[i] : wv[i];
      const al = base * (still ? 1 : 0.72 + 0.28 * Math.sin(t / 1700 + ph[i])) * (1 - lit);
      if (al < 0.02) continue;
      ctx.globalAlpha = al;
      const s = r[i] * 1.5;
      ctx.fillRect(x[i] - s / 2, y[i] - s / 2, s, s);
    }
    // Passe 2 : points allumés (pointeur ou onde), en accent.
    ctx.fillStyle = acc;
    for (let i = 0; i < n; i++) {
      const lit = a[i] > wv[i] ? a[i] : wv[i];
      if (lit < 0.03) continue;
      ctx.globalAlpha = lit; // toujours ≤ 1
      ctx.beginPath();
      ctx.arc(x[i], y[i], r[i] * 0.95, 0, 6.2832);
      ctx.fill();
    }
    // Front de l'onde.
    if (wr > 0 && amp > 0) {
      ctx.globalAlpha = 0.14 * amp;
      ctx.strokeStyle = acc; // lineWidth par défaut : 1
      ctx.beginPath();
      ctx.arc(wx, wy, wr, 0, 6.2832);
      ctx.stroke();
    }
  };

  const setup = (): void => {
    const cw = host.clientWidth;
    const ch = host.clientHeight;
    if (!cw || !ch || (cw === w && ch === h)) return;
    const dpr = Math.min(devicePixelRatio, 2);
    // Conversion WebIDL : la taille du bitmap est tronquée à l'entier.
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    w = cw;
    h = ch;
    const gap = w < 640 ? 22 : 28;
    const cols = ((w / gap) | 0) + 1;
    const rows = ((h / gap) | 0) + 1;
    const x0 = (w - (cols - 1) * gap) / 2;
    const y0 = (h - (rows - 1) * gap) / 2;
    n = cols * rows;
    [ox, oy, x, y, r, a, wv, ph] = Array.from({ length: 8 }, () => new Float32Array(n));
    for (let i = 0; i < n; i++) {
      x[i] = ox[i] = x0 + (i % cols) * gap;
      y[i] = oy[i] = y0 + ((i / cols) | 0) * gap;
      r[i] = 1;
      ph[i] = ox[i] / 230 + oy[i] / 310;
    }
    draw(now());
  };

  const frame = (t: number): void => {
    raf = 0;
    if (!inView || doc.hidden) return;
    step(t);
    draw(t);
    raf = requestAnimationFrame(frame);
  };

  const kick = (): void => {
    if (!raf && !still) raf = requestAnimationFrame(frame);
  };

  palette();
  setup();

  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(setup, 150);
  }).observe(host);

  new IntersectionObserver((entries) => {
    entries.forEach((e) => (inView = e.isIntersecting));
    kick();
  }).observe(host);

  doc.addEventListener('visibilitychange', kick);
  doc.addEventListener('themechange', () => {
    palette();
    draw(now());
  });

  if (opts.interactive !== false && !still) {
    host.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch') return;
        const b = host.getBoundingClientRect();
        // Conversion d'échelle si un ancêtre est transformé (scale).
        const k = b.width / (host.offsetWidth || b.width) || 1;
        px = (e.clientX - b.left) / k;
        py = (e.clientY - b.top) / k;
        on = true;
      },
      { passive: true },
    );
    host.addEventListener('pointerleave', () => (on = false));
  }
}
