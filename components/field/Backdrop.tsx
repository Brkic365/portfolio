'use client';

import { useEffect, useRef } from 'react';
import { createField } from '@/lib/field/engine';
import { PRESETS } from '@/lib/field/presets';
import { restingSignature, setBackdrop } from '@/lib/field/backdrop';
import { HOT, type Signature } from '@/lib/field/signatures';

/** Trail opacity at the very top of a page, where the backdrop stands in for the hero's field. */
const TOP = 0.55;
/** Share of the scroll the field follows, so it drifts with the page instead of sitting still behind it. */
const FOLLOW = 0.3;

/**
 * One field behind everything, on every page: a fixed canvas the size of the
 * viewport (never the page), mounted once in the shared layout so it survives
 * client navigation. It never has an edge, because it never ends.
 *
 * It is brightest at the top of a page and settles to the preset's level over
 * the first screen, follows the scroll at a fraction of its speed, bends
 * around the pointer anywhere on the page and takes a vortex on click. Its
 * signature is the page's: curl and orange on the index, the project's own on
 * a case study (see `PageSignature`), and whichever project is under the
 * pointer in the gallery.
 */
export default function Backdrop({ accents }: { accents: Partial<Record<Signature, string>> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const rest = restingSignature();
    const base = PRESETS.backdrop.outside;
    const level = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)));
      const e = p * p * (3 - 2 * p);
      return TOP + (base - TOP) * e;
    };
    const field = createField(c, {
      ...PRESETS.backdrop,
      host: document.documentElement,
      accent: HOT,
      accents: { ...accents, [rest.sig]: rest.accent },
      sig: rest.sig,
      outside: level(),
    });
    setBackdrop(field);

    let y = window.scrollY;
    const onScroll = () => {
      const ny = window.scrollY;
      const dy = ny - y;
      y = ny;
      field.level(level());
      // Anchor jumps would just wipe the field off screen; let it be.
      if (Math.abs(dy) < window.innerHeight) field.shift(0, -dy * FOLLOW);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      setBackdrop(null);
      field.destroy();
    };
    // Created once for the life of the site; accents never change after build.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <canvas ref={canvas} className="backdrop" aria-hidden="true" />;
}
