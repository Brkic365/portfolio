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
 * Paints a still of the field into a knockout's letters (a background clipped
 * to the text), so the view transition snapshots particles, not blank or solid
 * type. Returns false when there is nothing drawn to copy.
 */
function stillFrame(el: HTMLElement): boolean {
  if (el.dataset.ko !== 'on') return false;
  const c = fieldCanvasFor(el);
  if (!c || !c.width) return false;
  const cr = c.getBoundingClientRect(), r = el.getBoundingClientRect();
  if (!cr.width || !r.width || !r.height) return false;
  const sx = c.width / cr.width, sy = c.height / cr.height;
  const w = Math.max(1, Math.round(r.width * sx)), h = Math.max(1, Math.round(r.height * sy));
  const crop = document.createElement('canvas');
  crop.width = w;
  crop.height = h;
  const g = crop.getContext('2d');
  if (!g) return false;
  g.drawImage(c, (r.left - cr.left) * sx, (r.top - cr.top) * sy, w, h, 0, 0, w, h);
  try {
    el.style.backgroundImage = `url(${crop.toDataURL()})`;
  } catch {
    return false;
  }
  el.classList.add('ko-still');
  return true;
}

function clearStill(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove('ko-still');
  el.style.backgroundImage = '';
}

export function morphTo(router: Router, href: string, title: HTMLElement | null, targetId = 'case-title') {
  const root = document.documentElement;
  if (title) {
    title.style.viewTransitionName = 'project-title';
    title.classList.add('vt-title');
    stillFrame(title);
  }
  let next: HTMLElement | null = null;
  root.dataset.vt = 'out';
  const vt = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        router.push(href);
        const t0 = performance.now();
        // Timers rather than rAF: rendering is paused while the transition waits on us.
        // Wait for the new title's field to have drawn as well, so it is captured as
        // particles; without that it would snapshot as solid white for a moment.
        const poll = () => {
          const el = window.location.pathname === href ? document.getElementById(targetId) : null;
          if (el && el.dataset.ko) {
            next = el;
            stillFrame(el);
            resolve();
          } else if (performance.now() - t0 > 2500) resolve();
          else setTimeout(poll, 16);
        };
        poll();
      }),
  );
  vt.finished.finally(() => {
    delete root.dataset.vt;
    clearStill(next);
    if (title) {
      clearStill(title);
      title.style.viewTransitionName = '';
      title.classList.remove('vt-title');
    }
  });
  return vt;
}
