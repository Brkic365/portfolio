'use client';

import { prefersReducedMotion } from './engine';

type Router = { push(href: string): void; prefetch(href: string): void };

/** View transitions are available and wanted. */
export function canMorph(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function' &&
    !prefersReducedMotion()
  );
}

/**
 * Client-side navigation wrapped in a view transition, so `title` morphs into
 * the element on the next page that carries the same view-transition-name
 * (the case study hero title, `#case-title`).
 *
 * The App Router renders the new page asynchronously, so the update callback
 * resolves once the new title is in the DOM rather than when `push` returns.
 * If that takes too long it resolves anyway and the browser cross-fades. The
 * caller checks `canMorph()` first and lets the link navigate normally when it
 * is false.
 */
/** The canvas whose field traces `el`: its knockout wrap's, or else its section's. */
function fieldCanvasFor(el: HTMLElement): HTMLCanvasElement | null {
  return (el.closest('.ko-wrap, header, section')?.querySelector('canvas') as HTMLCanvasElement | null) ?? null;
}

/**
 * A still of the field behind a knockout, cropped to its letters, as a data
 * URL. Null when there is nothing drawn to copy.
 */
function stillOf(el: HTMLElement): string | null {
  if (el.dataset.ko !== 'on') return null;
  const c = fieldCanvasFor(el);
  if (!c || !c.width) return null;
  const cr = c.getBoundingClientRect(), r = el.getBoundingClientRect();
  if (!cr.width || !r.width || !r.height) return null;
  const sx = c.width / cr.width, sy = c.height / cr.height;
  const w = Math.max(1, Math.round(r.width * sx)), h = Math.max(1, Math.round(r.height * sy));
  const crop = document.createElement('canvas');
  crop.width = w;
  crop.height = h;
  const g = crop.getContext('2d');
  if (!g) return null;
  g.drawImage(c, (r.left - cr.left) * sx, (r.top - cr.top) * sy, w, h, 0, 0, w, h);
  try {
    return crop.toDataURL();
  } catch {
    return null;
  }
}

/** Fills a knockout's letters with a still (a background clipped to the text). */
function applyStill(el: HTMLElement, url: string) {
  el.style.backgroundImage = `url(${url})`;
  el.classList.add('ko-still');
}

function clearStill(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove('ko-still');
  el.style.backgroundImage = '';
}

/**
 * Keeps the borrowed still on the new title until its own field has drawn, so
 * the letters never go blank or solid in between. Gives up after a few seconds.
 */
function handOver(el: HTMLElement) {
  if (el.dataset.ko) return clearStill(el);
  const mo = new MutationObserver(() => {
    if (!el.dataset.ko) return;
    mo.disconnect();
    clearTimeout(timer);
    clearStill(el);
  });
  const timer = setTimeout(() => {
    mo.disconnect();
    clearStill(el);
  }, 4000);
  mo.observe(el, { attributes: true, attributeFilter: ['data-ko'] });
}

export function morphTo(router: Router, href: string, title: HTMLElement | null, targetId = 'case-title') {
  const root = document.documentElement;
  const still = title ? stillOf(title) : null;
  if (title) {
    title.style.viewTransitionName = 'project-title';
    title.classList.add('vt-title');
    if (still) applyStill(title, still);
  }
  let next: HTMLElement | null = null;
  root.dataset.vt = 'out';
  const vt = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        router.push(href);
        const t0 = performance.now();
        // Timers rather than rAF: rendering is paused while the transition waits on us.
        // Resolve as soon as the new title exists. Its own field cannot draw yet
        // (it starts from an IntersectionObserver, which is paused too), so it
        // borrows the old title's still and travels as the same particles.
        const poll = () => {
          const el = window.location.pathname === href ? document.getElementById(targetId) : null;
          if (el) {
            next = el;
            if (still) applyStill(el, still);
            resolve();
          } else if (performance.now() - t0 > 2500) resolve();
          else setTimeout(poll, 16);
        };
        poll();
      }),
  );
  vt.finished.finally(() => {
    delete root.dataset.vt;
    if (next) handOver(next);
    if (title) {
      clearStill(title);
      title.style.viewTransitionName = '';
      title.classList.remove('vt-title');
    }
  });
  return vt;
}
