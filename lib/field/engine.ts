/**
 * The field: particles traced through a flow into a fading trail buffer.
 *
 * Every canvas on a page shares one requestAnimationFrame loop. A field only
 * steps while it is on screen (IntersectionObserver) and the tab is visible,
 * and it is not even built until it first comes near the viewport, so a long
 * page pays for the fields you are looking at rather than all of them.
 *
 * With a mask (text drawn white), trails show at full strength inside the
 * letters and dimmed outside. That is what makes the knockouts. Under
 * prefers-reduced-motion a field renders one settled still frame and never
 * animates.
 *
 * Browser only. Nothing here touches `window` at import time, so client
 * components can import it and still render on the server; all of the work
 * starts from `createField`, which is only ever called from an effect.
 */

import { noise3 as Noise } from './noise';
import { HOT, SIGNATURES, SIGNATURE_KEYS, type Signature } from './signatures';

export type RGB = [number, number, number];

/**
 * Draws the knockout shape (white on transparent) into the mask buffer.
 * Return false to switch the field off, e.g. when the text is too small to
 * read as a knockout and should stay solid instead.
 */
export type MaskFn = (
  m: CanvasRenderingContext2D,
  W: number,
  H: number,
  dpr: number,
  rect: DOMRect,
) => boolean | void;

export interface FieldOptions {
  /** Element that receives pointer events. Defaults to the canvas's parent. */
  host?: HTMLElement | null;
  mask?: MaskFn | null;
  /** No mask at all: a plain band or backdrop. */
  plain: boolean;
  /** Accent for the base (curl) signature, as #rrggbb. */
  accent?: string;
  /** Accent per signature, used when the field morphs into it. */
  accents?: Partial<Record<Signature, string>>;
  /** Share of particles drawn in the accent rather than off-white. */
  share: number;
  /** CSS px² per particle. Lower is denser. */
  density: number;
  maxN: number;
  /** Particle cap when the canvas is narrower than 700 CSS px. */
  maxNarrow: number;
  speed: number;
  drift: number;
  scale: number;
  tStep: number;
  /** How fast trails fade. Lower means longer trails. */
  fade: number;
  /** Trail opacity outside the mask. */
  outside: number;
  /** Faint solid fill of the mask, so letterforms read before trails arrive. */
  fill: number;
  /**
   * Opacity of the ground colour painted inside the letters first. It hides the
   * background field behind a knockout, so the letters' own trails are not
   * lost among the backdrop's crossing through them.
   */
  base: number;
  /** Share of respawns placed inside the mask. */
  spawnIn: number;
  life: [number, number];
  dprMax: number;
  /** Steps run before the first frame, so a field never starts empty. */
  warm: number;
  /** Steps run for the still frame (reduced motion, frozen). */
  still: number;
  /** Off-white trail opacity. */
  light: number;
  push: number;
  swirl: number;
  sig: Signature;
  /** Assemble the mask out of scattered particles on the first frame. */
  form: boolean;
  formMs: number;
  /** Render one still frame and stop. Used for the social cards. */
  frozen: boolean;
  /** Click or tap to drop a vortex. */
  disturb: boolean;
  /** Told after every rebuild whether the knockout is drawn. */
  onMask?: (on: boolean) => void;
}

export interface FieldHandle {
  /** Ease into another signature over 600ms, optionally in a new colour (#rrggbb). */
  morph(sig: Signature, accent?: string): void;
  /** Set the trail opacity outside the mask (the whole field, for a plain one). */
  level(a: number): void;
  /** Move the field and its trails by (dx, dy) CSS px, e.g. to follow scroll. */
  shift(dx: number, dy: number): void;
  /** A vortex that decays over about 1.5s. CSS px relative to the canvas. */
  vortex(x: number, y: number): void;
  /** Stream particles out of a box (CSS px, relative to the canvas). */
  burst(x: number, y: number, w?: number, h?: number, ms?: number): void;
  sig(): Signature;
  /** Progress of the formation pass, 0 to 1. */
  formProgress(): number;
  /** Resolves once the first frame has been drawn. */
  ready: Promise<void>;
  destroy(): void;
}

export const DEFAULTS: FieldOptions = {
  mask: null,
  plain: false,
  share: 0.07,
  density: 240,
  maxN: 5200,
  maxNarrow: 1400,
  speed: 1.25,
  drift: 0.18,
  scale: 0.0016,
  tStep: 0.0016,
  fade: 0.04,
  outside: 0.13,
  fill: 0.16,
  base: 0.7,
  spawnIn: 0.6,
  life: [60, 220],
  dprMax: 1.5,
  warm: 40,
  still: 220,
  light: 0.8,
  push: 2.2,
  swirl: 2.8,
  sig: 'curl',
  form: false,
  formMs: 2600,
  frozen: false,
  disturb: true,
};

const K = SIGNATURE_KEYS.length;
const MORPH_MS = 600;
const PAPER: RGB = [237, 236, 230];
/** The page ground (#0e0e10), painted under a knockout's trails. */
const GROUND = 'rgb(14,14,16)';
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ------------------------------------------------------------------------
   Page-wide state, created on first use
   ------------------------------------------------------------------------ */

interface Field {
  live: boolean;
  off: boolean;
  built: boolean;
  frozen: boolean;
  canvas: HTMLCanvasElement;
  build(): void;
  step(): void;
  compose(): void;
}

/** Page-wide tuning. speed and density come from real activity data, boost from scroll velocity. */
const G = { speed: 1, density: 1, boost: 1 };

let booted = false;
let raf = 0;
let now = 0;
let hidden = false;
let reduceMq: MediaQueryList | null = null;
let io: IntersectionObserver | null = null;
const fields = new Set<Field>();
const byCanvas = new WeakMap<Element, Field>();
/** Fields waiting for their first build, done one per task so the page never blocks on all of them at once. */
const queue: Field[] = [];
let draining = false;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function reduced() {
  return reduceMq ? reduceMq.matches : false;
}

function tick() {
  raf = 0;
  now = performance.now();
  G.boost += (1 - G.boost) * 0.045;
  let any = false;
  for (const f of fields) {
    if (f.live && f.built && !f.off && !f.frozen) {
      f.step();
      f.compose();
      any = true;
    }
  }
  if (any && !hidden) raf = requestAnimationFrame(tick);
}

function wake() {
  if (!reduced() && !hidden && !raf) raf = requestAnimationFrame(tick);
}

function drain() {
  if (draining) return;
  draining = true;
  const next = () => {
    const f = queue.shift();
    if (!f) {
      draining = false;
      return;
    }
    if (fields.has(f) && !f.built) f.build();
    setTimeout(next, 0);
  };
  setTimeout(next, 0);
}

function boot() {
  if (booted) return;
  booted = true;
  now = performance.now();
  reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  hidden = document.hidden;

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const f = byCanvas.get(e.target);
        if (!f) continue;
        f.live = e.isIntersecting && !reduced();
        if (e.isIntersecting && !f.built && !queue.includes(f)) {
          queue.push(f);
          drain();
        }
      }
      wake();
    },
    // Build a little ahead of the viewport, so a knockout is ready before it is seen.
    { rootMargin: '320px 0px' },
  );

  // The tab is hidden: stop the loop outright rather than trusting rAF throttling.
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    if (hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else wake();
  });

  // Scroll velocity briefly speeds up every trail. Works for touch scrolling too.
  let sy = window.scrollY;
  let sT = performance.now();
  window.addEventListener(
    'scroll',
    () => {
      const n = performance.now();
      const dy = Math.abs(window.scrollY - sy);
      const dt = Math.max(12, n - sT);
      sy = window.scrollY;
      sT = n;
      if (reduced() || dy > 2000) return; // ignore anchor jumps
      const b = 1 + Math.min(1.5, (dy / dt) * 0.5);
      if (b > G.boost) G.boost = b;
      wake();
    },
    { passive: true },
  );
}

/**
 * Commits in the last 30 days (or null) mapped to field speed and density,
 * clamped so a quiet month is calm rather than dead and a busy one is lively
 * rather than frantic. Call before fields build; density is read on build.
 */
export function tune(commits: number | null | undefined): boolean {
  if (typeof commits !== 'number' || !Number.isFinite(commits)) {
    G.speed = 1;
    G.density = 1;
    return false;
  }
  const k = Math.max(0, Math.min(1, commits / 120));
  G.speed = 0.8 + 0.5 * k;
  G.density = 0.85 + 0.35 * k;
  return true;
}

let fontsPromise: Promise<void> | null = null;
function fontsReady(): Promise<void> {
  if (!fontsPromise) {
    fontsPromise = Promise.race([
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
      new Promise<void>((r) => setTimeout(r, 3000)),
    ]).catch(() => undefined);
  }
  return fontsPromise;
}

/* ------------------------------------------------------------------------
   One field
   ------------------------------------------------------------------------ */

export function createField(canvas: HTMLCanvasElement, opt: Partial<FieldOptions>): FieldHandle {
  boot();
  const o: FieldOptions = { ...DEFAULTS, ...opt };
  const host = o.host || canvas.parentElement || canvas;
  const v = canvas.getContext('2d')!;
  const mk = (rf?: boolean): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const c = document.createElement('canvas');
    return [c, c.getContext('2d', rf ? { willReadFrequently: true } : undefined)!];
  };
  const [trail, tc] = mk();
  const [inside, ic] = o.plain ? [null, null] : mk();
  const [mask, mc] = o.plain ? [null, null] : mk(true);

  let W = 0, H = 0, cssW = 0, cssH = 0, dpr = 1, N = 0;
  let X = new Float32Array(0), Y = X, PX = X, PY = X, L = X, Y0 = X;
  let C = new Uint8Array(0), DIR = C;
  let SX: Float32Array | null = null, SY: Float32Array | null = null, TX: Float32Array | null = null, TY: Float32Array | null = null, FD: Float32Array | null = null;
  let pts: number[] = [];
  let t = Math.random() * 100;
  const mouse = { x: -1e4, y: -1e4, on: false };
  let dead = false;
  let forming = false;
  let formDone = false;
  let formT0 = 0;
  let formP = 0;
  let outsideNow = o.outside;
  let shiftX = 0, shiftY = 0;
  let insideNow = 1;
  let resolveReady: () => void = () => {};
  const ready = new Promise<void>((r) => (resolveReady = r));

  // Per-field signature weights. The curl slot keeps the page's own accent.
  const acc: RGB[] = SIGNATURE_KEYS.map((k) => {
    const a = o.accents?.[k] ?? (k === 'curl' || k === o.sig ? o.accent : undefined);
    return hexToRgb(a ?? (k === 'curl' ? HOT : o.accent ?? HOT));
  });
  const w = new Float32Array(K), wFrom = new Float32Array(K), wTo = new Float32Array(K);
  const s0 = Math.max(0, SIGNATURE_KEYS.indexOf(o.sig));
  w[s0] = wFrom[s0] = wTo[s0] = 1;
  let mT0 = -1e9;
  let sigNow: Signature = SIGNATURE_KEYS[s0];
  const vort: { x: number; y: number; t0: number; s: number; k: number; dir: number }[] = [];
  let burst: { l: number; t: number; r: number; b: number; x: number; y: number; t0: number; dur: number } | null = null;

  const f: Field = {
    live: false,
    off: false,
    built: false,
    frozen: o.frozen,
    canvas,
    build,
    step,
    compose,
  };

  function spawn(i: number, anywhere?: boolean) {
    if (!anywhere && pts.length && Math.random() < o.spawnIn) {
      const k = (Math.random() * (pts.length / 2)) | 0;
      X[i] = pts[k * 2] + Math.random() * 3;
      Y[i] = pts[k * 2 + 1] + Math.random() * 3;
    } else {
      X[i] = Math.random() * W;
      Y[i] = Math.random() * H;
    }
    PX[i] = X[i];
    PY[i] = Y[i];
    Y0[i] = Y[i];
    DIR[i] = (Math.random() * 4) | 0;
    L[i] = o.life[0] + Math.random() * o.life[1];
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    cssW = r.width;
    cssH = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, o.dprMax);
    W = Math.max(1, Math.round(r.width * dpr));
    H = Math.max(1, Math.round(r.height * dpr));
    for (const c of [canvas, trail, inside, mask]) if (c) { c.width = W; c.height = H; }
    const cap = r.width < 700 ? o.maxNarrow : o.maxN;
    N = Math.max(0, Math.round(Math.min(cap, ((r.width * r.height) / o.density) * G.density)));
    X = new Float32Array(N); Y = new Float32Array(N); PX = new Float32Array(N); PY = new Float32Array(N);
    L = new Float32Array(N); Y0 = new Float32Array(N); C = new Uint8Array(N); DIR = new Uint8Array(N);
    pts = [];
    f.off = r.width < 2 || r.height < 2 || N === 0;
    if (!o.plain && !f.off && mc && o.mask) {
      mc.clearRect(0, 0, W, H);
      mc.save();
      mc.fillStyle = '#fff';
      f.off = o.mask(mc, W, H, dpr, r) === false;
      mc.restore();
      if (!f.off) {
        const img = mc.getImageData(0, 0, W, H).data;
        const s = Math.max(3, Math.round(4 * dpr));
        for (let y = 0; y < H; y += s) for (let x = 0; x < W; x += s) if (img[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
      }
    }
    canvas.style.visibility = f.off ? 'hidden' : '';
    for (let i = 0; i < N; i++) {
      spawn(i, o.plain || Math.random() > 0.5);
      L[i] *= Math.random();
      C[i] = Math.random() < o.share ? 1 : 0;
    }
    tc.clearRect(0, 0, W, H);
    // Formation: start scattered, each particle owns a point inside the letters.
    if (o.form && !formDone && !reduced() && pts.length) {
      forming = true;
      formT0 = 0;
      SX = new Float32Array(N); SY = new Float32Array(N); TX = new Float32Array(N); TY = new Float32Array(N); FD = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const k = (Math.random() * (pts.length / 2)) | 0;
        TX[i] = pts[k * 2] + Math.random() * 3;
        TY[i] = pts[k * 2 + 1] + Math.random() * 3;
        SX[i] = (Math.random() * 1.1 - 0.05) * W;
        SY[i] = (Math.random() * 1.1 - 0.05) * H;
        // Departures are staggered and none leave at once: the hero opens as loose noise,
        // then the particles peel off into the letters a few at a time.
        FD[i] = 0.16 + Math.random() * 0.32;
        X[i] = PX[i] = SX[i];
        Y[i] = PY[i] = SY[i];
      }
    } else forming = false;
  }

  function settle(n: number) {
    if (f.off) return;
    if (forming) {
      compose();
      return;
    }
    now = performance.now();
    for (let k = 0; k < n; k++) step();
    compose();
  }

  function build() {
    if (dead) return;
    resize();
    settle(reduced() || o.frozen ? o.still : o.warm);
    f.built = true;
    o.onMask?.(!o.plain && !f.off);
    resolveReady();
    wake();
  }

  /** The formation pass: scattered points glide into the letterforms, curling on the way. */
  function stepForm() {
    if (!SX || !SY || !TX || !TY || !FD) return;
    if (!formT0) formT0 = now;
    const p = Math.min(1, (now - formT0) / o.formMs);
    formP = p;
    const sc = (o.scale / dpr) * 0.8, amp = 55 * dpr, cap = 11 * dpr, cs = o.scale / dpr;
    const sp = o.speed * dpr * G.speed, dr = o.drift * dpr;
    t += o.tStep;
    // Trails show evenly while the particles travel, then the knockout fades in as they arrive.
    const lit = Math.pow(Math.max(0, (p - 0.5) / 0.5), 1.5);
    outsideNow = 0.8 + (o.outside - 0.8) * lit;
    insideNow = lit;
    tc.globalCompositeOperation = 'destination-out';
    tc.fillStyle = 'rgba(0,0,0,.16)';
    tc.fillRect(0, 0, W, H);
    tc.globalCompositeOperation = 'source-over';
    tc.lineWidth = dpr;
    const paths = [new Path2D(), new Path2D()];
    for (let i = 0; i < N; i++) {
      const nx = SX[i] * sc, ny = SY[i] * sc;
      const bx = Noise(nx, ny + 0.6, 3.7) - Noise(nx, ny - 0.6, 3.7);
      const by = -(Noise(nx + 0.6, ny, 3.7) - Noise(nx - 0.6, ny, 3.7));
      PX[i] = X[i];
      PY[i] = Y[i];
      if (FD[i] < 0) {
        // Arrived: flow on with the ordinary curl field so the letters fill with motion, not dots.
        const x = X[i], y = Y[i], qx = x * cs, qy = y * cs;
        X[i] = x + (Noise(qx, qy + 0.6, t) - Noise(qx, qy - 0.6, t)) * sp + dr;
        Y[i] = y - (Noise(qx + 0.6, qy, t) - Noise(qx - 0.6, qy, t)) * sp;
      } else {
        const pi = Math.max(0, Math.min(1, (p - FD[i]) / (1 - FD[i])));
        if (pi === 0) {
          // Not left yet: wander with the curl field as plain noise. The start point moves
          // with it, so the glide into the letters begins wherever the particle has got to.
          const qx = SX[i] * cs, qy = SY[i] * cs;
          SX[i] += (Noise(qx, qy + 0.6, t) - Noise(qx, qy - 0.6, t)) * sp * 1.4 + dr;
          SY[i] -= (Noise(qx + 0.6, qy, t) - Noise(qx - 0.6, qy, t)) * sp * 1.4;
          X[i] = SX[i];
          Y[i] = SY[i];
        } else {
          const e = 1 - Math.pow(1 - pi, 3), bend = Math.sin(Math.PI * e) * amp;
          X[i] = SX[i] + (TX[i] - SX[i]) * e + bx * bend;
          Y[i] = SY[i] + (TY[i] - SY[i]) * e + by * bend;
          if (e > 0.96) FD[i] = -1;
        }
      }
      // Draw only the newest stretch of each move, so streaks stay short whatever the frame rate.
      const dx = X[i] - PX[i], dy = Y[i] - PY[i], d = Math.sqrt(dx * dx + dy * dy), k = d > cap ? cap / d : 1;
      const q = paths[C[i]];
      q.moveTo(X[i] - dx * k, Y[i] - dy * k);
      q.lineTo(X[i], Y[i]);
    }
    tc.strokeStyle = `rgba(${PAPER},${o.light})`;
    tc.stroke(paths[0]);
    tc.strokeStyle = `rgba(${acc[0]},0.95)`;
    tc.stroke(paths[1]);
    if (p >= 1) {
      forming = false;
      formDone = true;
      outsideNow = o.outside;
      insideNow = 1;
      for (let i = 0; i < N; i++) L[i] = o.life[0] + Math.random() * o.life[1];
      SX = SY = TX = TY = FD = null;
    }
  }

  function step() {
    if (forming) return stepForm();
    t += o.tStep;
    // Advance the signature blend.
    const me = ease(Math.min(1, (now - mT0) / MORPH_MS));
    for (let k = 0; k < K; k++) w[k] = wFrom[k] + (wTo[k] - wFrom[k]) * me;
    let ar = 0, ag = 0, ab = 0, tint = 0, fm = 0;
    for (let k = 0; k < K; k++) {
      const a = acc[k], s = SIGNATURES[SIGNATURE_KEYS[k]];
      ar += a[0] * w[k]; ag += a[1] * w[k]; ab += a[2] * w[k];
      tint += s.tint * w[k];
      fm += s.fade * w[k];
    }
    const [wCurl, wOrbit, wGrain, wSwirl, wPulse, wBub, wGrid, wStream, wTick, wSun, wWind] = w;
    const needCurl = wCurl + wOrbit + wPulse + wGrid + wSun + wWind > 0.001;
    // The sun's angle swings slowly, as if the clock were being dragged through the day.
    const sunA = 0.55 + 0.28 * Math.sin(now / 7000), sunX = Math.cos(sunA), sunY = Math.sin(sunA);
    const BS = 64 * dpr;

    const sc = o.scale / dpr, e = 0.6, sp = o.speed * dpr * G.speed * G.boost, dr = o.drift * dpr;
    const R = 150 * dpr, R2 = R * R;
    const cx0 = W / 2, cy0 = H / 2, Rm = Math.min(W, H);
    const ps = Math.sin((now / 1000) * Math.PI * 2);
    const pulse = Math.sign(ps) * Math.pow(Math.abs(ps), 0.55);
    const GS = 30 * dpr, VR = 150 * dpr, VR2 = VR * VR, TS = 22 * dpr;
    for (let j = vort.length - 1; j >= 0; j--) {
      const a = (now - vort[j].t0) / 1500;
      if (a >= 1) vort.splice(j, 1);
      else vort[j].k = vort[j].s * (1 - a) * (1 - a);
    }
    let bk = 0;
    if (burst) {
      const a = (now - burst.t0) / burst.dur;
      if (a >= 1) burst = null;
      else bk = (1 - a * a) * 13 * dpr;
    }

    tc.globalCompositeOperation = 'destination-out';
    tc.fillStyle = `rgba(0,0,0,${Math.min(0.2, o.fade * fm)})`;
    tc.fillRect(0, 0, W, H);
    tc.globalCompositeOperation = 'source-over';
    tc.lineWidth = dpr;
    const paths = [new Path2D(), new Path2D()];
    for (let i = 0; i < N; i++) {
      const x = X[i], y = Y[i], nx = x * sc, ny = y * sc;
      let vx = 0, vy = 0, cx = 0, cy = 0;
      if (needCurl) {
        // Curl of the noise field: divergence-free, so trails swirl instead of clumping.
        cx = Noise(nx, ny + e, t) - Noise(nx, ny - e, t);
        cy = -(Noise(nx + e, ny, t) - Noise(nx - e, ny, t));
      }
      if (wCurl > 0.001) { vx += (cx * sp + dr) * wCurl; vy += cy * sp * wCurl; }
      if (wOrbit > 0.001) {
        // Concentric ellipses, as if seen around a turntable.
        const dx = x - cx0, dy = (y - cy0) / 0.42, r = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const s = sp * 1.7 * Math.min(1, r / (Rm * 0.2));
        vx += ((-dy / r) * s + cx * sp * 0.2) * wOrbit;
        vy += ((dx / r) * s * 0.42 + cy * sp * 0.2) * wOrbit;
      }
      if (wGrain > 0.001) {
        // Long parallel lines; neighbours share their waver, like grain.
        const g = Noise(nx * 0.7, ny * 0.35, t * 0.5) * 0.5 + Noise(nx * 2.4, ny * 5, t) * 0.07;
        vx += sp * 1.7 * wGrain;
        vy += sp * g * wGrain;
      }
      if (wSwirl > 0.001) {
        const n2x = nx * 0.55, n2y = ny * 0.55, t2 = t * 0.7;
        const qx = Noise(n2x, n2y + e, t2) - Noise(n2x, n2y - e, t2);
        const qy = -(Noise(n2x + e, n2y, t2) - Noise(n2x - e, n2y, t2));
        const dx = x - cx0, dy = y - cy0, r = Math.sqrt(dx * dx + dy * dy) + 0.001;
        vx += (qx * sp * 0.9 - (dy / r) * sp * 0.35) * wSwirl;
        vy += (qy * sp * 0.9 + (dx / r) * sp * 0.35) * wSwirl;
      }
      if (wPulse > 0.001) {
        // Breathe out and in about once a second, like reps.
        const dx = x - cx0, dy = y - cy0, k = (sp * 2.6 * pulse) / (Rm * 0.5);
        let px = dx * k, py = dy * k;
        const m = Math.hypot(px, py), cap = sp * 3.2;
        if (m > cap) { px *= cap / m; py *= cap / m; }
        vx += (px + cx * sp * 0.3) * wPulse;
        vy += (py + cy * sp * 0.3) * wPulse;
      }
      if (wBub > 0.001) {
        const rise = 0.75 + (i % 7) * 0.08;
        vx += sp * 0.85 * Math.sin((y * 0.03) / dpr + i * 1.7) * wBub;
        vy += -sp * rise * wBub;
      }
      if (wGrid > 0.001) {
        // Travel along streets, turn at intersections where the noise says so.
        const d = DIR[i], s = sp * 1.9;
        let gx = d === 0 ? s : d === 1 ? -s : 0, gy = d === 2 ? s : d === 3 ? -s : 0;
        if (d < 2) {
          gy = (Math.round(y / GS) * GS - y) * 0.45;
          if (Math.floor(x / GS) !== Math.floor((x + gx) / GS))
            DIR[i] = Math.abs(cx) > Math.abs(cy) * 0.8 ? (cx > 0 ? 0 : 1) : cy > 0 ? 2 : 3;
        } else {
          gx = (Math.round(x / GS) * GS - x) * 0.45;
          if (Math.floor(y / GS) !== Math.floor((y + gy) / GS))
            DIR[i] = Math.abs(cy) > Math.abs(cx) * 0.8 ? (cy > 0 ? 2 : 3) : cx > 0 ? 0 : 1;
        }
        vx += gx * wGrid;
        vy += gy * wGrid;
      }
      if (wStream > 0.001) {
        // A fast horizontal stream that jumps where the "graph" spikes.
        const u = x / W, lane = Y0[i];
        const n = Noise(u * 6.5, t * 2.2, 3.1), k = Math.max(0, n - 0.32) / 0.68;
        const amp = H * 0.2 * (0.45 + 0.55 * (Noise(lane * sc * 3, 1.7, t) * 0.5 + 0.5));
        const ty = lane - Math.pow(k, 2.4) * amp + Noise(u * 70, lane * 0.01, t * 6) * 2.5 * dpr;
        vx += sp * 3 * wStream;
        vy += (ty - y) * 0.5 * wStream;
      }
      if (wTick > 0.001) {
        // Price ticks: the level is fixed within each tick and jumps between them,
        // so trails draw flat runs broken by sudden vertical moves, with a little jitter.
        const lane = Y0[i], q = Math.floor(x / TS);
        const walk = Noise(q * 0.31, lane * sc * 2.2, t * 1.4) + Noise(q * 1.7, lane * sc * 5, t * 3) * 0.35;
        const ty = lane + walk * H * 0.14 + Noise(q * 3.1, i * 0.37, t * 12) * 2.2 * dpr;
        vx += sp * 2.3 * wTick;
        vy += (ty - y) * 0.55 * wTick;
      }
      if (wSun > 0.001) {
        // Sunlight: long parallel rays. Where a blocky noise says a building stands,
        // the light is in shade and the ray slows to a crawl, so blocks read as gaps.
        const shade = Noise(Math.floor(x / BS) * 0.9, Math.floor(y / BS) * 0.9, 5.3) > 0.18 ? 0.3 : 1;
        vx += (sunX * sp * 2.3 * shade + cx * sp * 0.12) * wSun;
        vy += (sunY * sp * 2.3 * shade + cy * sp * 0.12) * wSun;
      }
      if (wWind > 0.001) {
        // Bura: blowing from the north-east, down and to the left. Speed depends on the
        // position across the flow, so it breaks into narrow fast jets with slack air
        // between, as it does below the mountain gaps, and gusts travel down each jet.
        const across = (x * 0.78 + y * 0.62) * sc, along = (x * -0.62 + y * 0.78) * sc;
        const jet = 0.35 + 2.6 * Math.max(0, Noise(across * 1.7, 2.9, t * 0.25));
        const gust = 0.8 + 0.4 * Noise(along * 0.9 - t * 2, across * 0.5, 7.7);
        vx += (-0.62 * sp * 1.8 * jet * gust + cx * sp * 0.15) * wWind;
        vy += (0.78 * sp * 1.8 * jet * gust + cy * sp * 0.15) * wWind;
      }
      if (mouse.on) {
        const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R2 * 4) {
          const d = Math.sqrt(d2) + 0.001, k = Math.exp(-d2 / R2) * dpr;
          vx += (dx / d) * k * o.push + (-dy / d) * k * o.swirl;
          vy += (dy / d) * k * o.push + (dx / d) * k * o.swirl;
        }
      }
      for (let j = 0; j < vort.length; j++) {
        const V = vort[j], dx = x - V.x, dy = y - V.y, d2 = dx * dx + dy * dy;
        if (d2 < VR2 * 9) {
          const d = Math.sqrt(d2) + 0.001, k = Math.exp(-d2 / VR2) * V.k;
          vx += (-dy / d) * k * V.dir - (dx / d) * k * 0.22;
          vy += (dx / d) * k * V.dir - (dy / d) * k * 0.22;
        }
      }
      if (bk && burst) {
        // Push away from the nearest point of the source box, so the stream fans out of the whole title.
        const qx = Math.max(burst.l, Math.min(burst.r, x)), qy = Math.max(burst.t, Math.min(burst.b, y));
        let dx = x - qx, dy = y - qy;
        if (!dx && !dy) { dx = x - burst.x; dy = (y - burst.y) * 3; }
        const d = Math.sqrt(dx * dx + dy * dy) + 0.001, k = bk * Math.exp(-d / (Rm * 0.8));
        vx += (dx / d) * k;
        vy += (dy / d) * k;
      }
      PX[i] = x; PY[i] = y; X[i] = x + vx; Y[i] = y + vy; L[i] -= 1;
      if (L[i] < 0 || X[i] < -10 || X[i] > W + 10 || Y[i] < -10 || Y[i] > H + 10) { spawn(i); continue; }
      const p = paths[C[i]];
      p.moveTo(PX[i], PY[i]);
      p.lineTo(X[i], Y[i]);
    }
    const lr = Math.round(PAPER[0] + (ar - PAPER[0]) * tint);
    const lg = Math.round(PAPER[1] + (ag - PAPER[1]) * tint);
    const lb = Math.round(PAPER[2] + (ab - PAPER[2]) * tint);
    tc.strokeStyle = `rgba(${lr},${lg},${lb},${o.light})`;
    tc.stroke(paths[0]);
    tc.strokeStyle = `rgba(${ar | 0},${ag | 0},${ab | 0},0.95)`;
    tc.stroke(paths[1]);
  }

  function compose() {
    v.globalCompositeOperation = 'source-over';
    v.globalAlpha = 1;
    v.clearRect(0, 0, W, H);
    v.globalAlpha = outsideNow;
    v.drawImage(trail, 0, 0);
    if (o.plain || !mask || !inside || !ic) {
      v.globalAlpha = 1;
      return;
    }
    if (o.base > 0) {
      // Ground first, so the backdrop does not show through the letters.
      ic.globalCompositeOperation = 'source-over';
      ic.clearRect(0, 0, W, H);
      ic.drawImage(mask, 0, 0);
      ic.globalCompositeOperation = 'source-in';
      ic.fillStyle = GROUND;
      ic.fillRect(0, 0, W, H);
      v.globalAlpha = o.base * insideNow;
      v.drawImage(inside, 0, 0);
    }
    v.globalAlpha = o.fill * insideNow;
    v.drawImage(mask, 0, 0);
    v.globalAlpha = insideNow;
    ic.globalCompositeOperation = 'source-over';
    ic.clearRect(0, 0, W, H);
    ic.drawImage(trail, 0, 0);
    ic.globalCompositeOperation = 'destination-in';
    ic.drawImage(mask, 0, 0);
    v.drawImage(inside, 0, 0);
    v.globalAlpha = 1;
  }

  /* Pointer: the field bends around the cursor, and a click drops a vortex. */
  const local = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const onMove = (e: PointerEvent) => {
    const [x, y] = local(e);
    mouse.x = x * dpr;
    mouse.y = y * dpr;
    mouse.on = e.pointerType === 'mouse' || e.pressure > 0;
  };
  const onLeave = () => { mouse.on = false; };
  const onUp = (e: PointerEvent) => { if (e.pointerType !== 'mouse') mouse.on = false; };
  const onDown = (e: PointerEvent) => {
    const [x, y] = local(e);
    if (x >= 0 && y >= 0 && x <= cssW && y <= cssH) handle.vortex(x, y);
  };
  if (!o.frozen) {
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerup', onUp);
    if (o.disturb) host.addEventListener('pointerdown', onDown, { passive: true });
  }

  /* Rebuild when the canvas changes size. Phones fire resize when the URL bar
     slides, so on coarse pointers only a width change counts. */
  let rt: ReturnType<typeof setTimeout> | undefined;
  const ro =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          if (!f.built) return;
          const r = canvas.getBoundingClientRect();
          const dw = Math.abs(r.width - cssW) > 0.5, dh = Math.abs(r.height - cssH) > 0.5;
          if (!dw && !(dh && !window.matchMedia('(pointer: coarse)').matches)) return;
          clearTimeout(rt);
          rt = setTimeout(() => {
            if (dead) return;
            resize();
            settle(reduced() ? o.still : o.warm);
            o.onMask?.(!o.plain && !f.off);
            wake();
          }, 150);
        });

  const handle: FieldHandle = {
    morph(name, accent) {
      const k = SIGNATURE_KEYS.indexOf(name);
      if (k < 0) return;
      if (accent) acc[k] = hexToRgb(accent);
      if (name === sigNow) return;
      sigNow = name;
      wFrom.set(w);
      wTo.fill(0);
      wTo[k] = 1;
      mT0 = performance.now();
      if (reduced() && f.built) {
        // No easing under reduced motion: jump to the new signature and redraw one still frame.
        w.set(wTo);
        wFrom.set(wTo);
        mT0 = -1e9;
        tc.clearRect(0, 0, W, H);
        settle(Math.round(o.still / 2));
      }
      wake();
    },
    level(a) {
      if (a === o.outside) return;
      o.outside = a;
      if (!forming) outsideNow = a;
      // The loop recomposes every frame; when it is not running (reduced motion, idle), do it now.
      if (f.built && !f.off && !raf) compose();
    },
    shift(dx, dy) {
      if (reduced() || o.frozen || f.off || !f.built) return;
      // Whole device pixels only, so the trail buffer never resamples (and blurs) as it moves.
      shiftX += dx * dpr;
      shiftY += dy * dpr;
      const ox = Math.round(shiftX), oy = Math.round(shiftY);
      if (!ox && !oy) return;
      shiftX -= ox;
      shiftY -= oy;
      for (let i = 0; i < N; i++) {
        X[i] += ox; PX[i] += ox;
        Y[i] += oy; PY[i] += oy; Y0[i] += oy;
      }
      tc.globalCompositeOperation = 'copy';
      tc.drawImage(trail, ox, oy);
      tc.globalCompositeOperation = 'source-over';
      if (!raf) compose();
      wake();
    },
    vortex(x, y) {
      if (reduced() || f.off || o.frozen) return;
      vort.push({ x: x * dpr, y: y * dpr, t0: performance.now(), s: 9 * dpr, k: 0, dir: vort.length % 2 ? -1 : 1 });
      if (vort.length > 6) vort.shift();
      wake();
    },
    burst(bx, by, bw = 0, bh = 0, dur = 480) {
      if (reduced() || f.off || !f.built) return;
      const l = bx * dpr, t0 = by * dpr, r = (bx + bw) * dpr, b = (by + bh) * dpr;
      burst = { l, t: t0, r, b, x: (l + r) / 2, y: (t0 + b) / 2, t0: performance.now(), dur };
      for (let i = 0; i < N; i++) {
        if (Math.random() < 0.55) {
          X[i] = PX[i] = l + Math.random() * (r - l);
          Y[i] = PY[i] = t0 + Math.random() * (b - t0);
          L[i] = o.life[0] + o.life[1];
          C[i] = Math.random() < 0.6 ? 1 : 0;
        }
      }
      f.live = true;
      wake();
    },
    sig: () => sigNow,
    formProgress: () => (formDone ? 1 : formP),
    ready,
    destroy() {
      dead = true;
      fields.delete(f);
      byCanvas.delete(canvas);
      const qi = queue.indexOf(f);
      if (qi >= 0) queue.splice(qi, 1);
      io?.unobserve(canvas);
      ro?.disconnect();
      clearTimeout(rt);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerup', onUp);
      host.removeEventListener('pointerdown', onDown);
    },
  };

  fields.add(f);
  byCanvas.set(canvas, f);

  // Wait for fonts so a knockout traces the real face, not the fallback.
  fontsReady().then(() => {
    if (dead) return;
    if (o.frozen) {
      build();
      return;
    }
    io?.observe(canvas);
    ro?.observe(canvas);
  });

  return handle;
}

/* ------------------------------------------------------------------------
   Masks
   ------------------------------------------------------------------------ */

const STRETCH: [number, CanvasFontStretch][] = [
  [50, 'ultra-condensed'],
  [62.5, 'extra-condensed'],
  [75, 'condensed'],
  [87.5, 'semi-condensed'],
  [100, 'normal'],
  [112.5, 'semi-expanded'],
  [125, 'expanded'],
  [150, 'extra-expanded'],
  [200, 'ultra-expanded'],
];

/** Canvas only takes stretch keywords, so snap a computed percentage to the nearest one. */
function stretchKeyword(computed: string): CanvasFontStretch {
  const pct = computed.endsWith('%') ? parseFloat(computed) : NaN;
  if (!Number.isFinite(pct)) return STRETCH.find(([, k]) => k === computed)?.[1] ?? 'normal';
  let best = STRETCH[0];
  for (const s of STRETCH) if (Math.abs(s[0] - pct) < Math.abs(best[0] - pct)) best = s;
  return best[1];
}


/**
 * A mask that draws an element's own text exactly where the browser laid it
 * out. Each word is measured with a Range, so the element's DOM is never
 * touched: it stays real, selectable, accessible text that React owns.
 *
 * Returns false (keep the text solid) when the text is smaller than minSize.
 */
export function textMask(el: HTMLElement, minSize = 0): MaskFn {
  return (ctx, _W, _H, dpr, cr) => {
    const m = ctx;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    if (size < minSize) return false;
    const italic = cs.fontStyle === 'italic' ? 'italic ' : '';
    m.font = `${italic}${cs.fontWeight} ${size * dpr}px ${cs.fontFamily}`;
    // The font shorthand resets fontStretch, so the stretch has to be set after it.
    if ('fontStretch' in m) m.fontStretch = stretchKeyword(cs.fontStretch);
    const ls = parseFloat(cs.letterSpacing) || 0;
    if ('letterSpacing' in m) m.letterSpacing = `${ls * dpr}px`;
    m.textBaseline = 'alphabetic';
    const asc = m.measureText('Hg').fontBoundingBoxAscent;

    // Visually hidden text (an sr-only label beside an aria-hidden visual) is not part of the shape.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.parentElement?.closest('.sr-only') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const range = document.createRange();
    let drew = false;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent || '';
      const re = /\S+/g;
      for (let mt = re.exec(text); mt; mt = re.exec(text)) {
        range.setStart(n, mt.index);
        range.setEnd(n, mt.index + mt[0].length);
        const rects = range.getClientRects();
        if (rects.length !== 1) continue;
        const r = rects[0];
        if (!r.width) continue;
        // Pin each word to the width the browser gave it, so the field lines up with the real text.
        const k = (r.width * dpr) / (m.measureText(mt[0]).width || 1);
        m.save();
        m.translate((r.left - cr.left) * dpr, (r.top - cr.top) * dpr + asc);
        m.scale(k > 0.9 && k < 1.1 ? k : 1, 1);
        m.fillText(mt[0], 0, 0);
        m.restore();
        drew = true;
      }
    }
    return drew;
  };
}
