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
export function morphTo(router: Router, href: string, title: HTMLElement | null, targetId = 'case-title') {
  const root = document.documentElement;
  if (title) {
    title.style.viewTransitionName = 'project-title';
    // Captured solid: a transparent knockout would snapshot as nothing.
    title.classList.add('vt-title');
  }
  root.dataset.vt = 'out';
  const vt = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        router.push(href);
        const t0 = performance.now();
        // Timers rather than rAF: rendering is paused while the transition waits on us.
        const poll = () => {
          const arrived = window.location.pathname === href && document.getElementById(targetId);
          if (arrived || performance.now() - t0 > 2500) resolve();
          else setTimeout(poll, 16);
        };
        poll();
      }),
  );
  vt.finished.finally(() => {
    delete root.dataset.vt;
    if (title) {
      title.style.viewTransitionName = '';
      title.classList.remove('vt-title');
    }
  });
  return vt;
}
