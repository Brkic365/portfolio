'use client';

import { useEffect, type RefObject } from 'react';
import { createField, prefersReducedMotion, textMask, type FieldHandle, type FieldOptions } from './engine';
import { PRESETS, type Preset } from './presets';
import type { Signature } from './signatures';

export interface FieldProps {
  preset?: Preset;
  sig?: Signature;
  /** #rrggbb. The project's accent on a case study, the site's orange elsewhere. */
  accent?: string;
  accents?: Partial<Record<Signature, string>>;
  /** Text smaller than this (CSS px) stays solid instead of becoming a knockout. */
  minSize?: number;
  /** Assemble the traced text out of loose noise, once per page load. */
  formOnce?: boolean;
  /** Handed the field once it exists, and null when it goes away. */
  onField?: (field: FieldHandle | null) => void;
}

let formed = false;

/**
 * Whether this mount should play the formation pass: once per page load, so a
 * fresh visit or a reload always opens on noise, while coming back to the home
 * page through the site's own links does not replay it.
 */
function claimFormation(): boolean {
  if (formed || prefersReducedMotion()) return false;
  formed = true;
  return true;
}

/**
 * Creates a field on a canvas for the lifetime of the component. When `traced`
 * is given, the field draws that element's text as a knockout and marks it
 * with data-ko="on" so CSS can make the real text transparent. Until then,
 * and without JavaScript, the text stays solid and readable.
 */
export function useField(
  canvas: RefObject<HTMLCanvasElement | null>,
  traced: RefObject<HTMLElement | null> | (() => HTMLElement | null) | null,
  { preset = 'quiet', sig, accent, accents, minSize = 0, formOnce, onField }: FieldProps,
  extra?: Partial<FieldOptions>,
) {
  const accentsKey = accents ? JSON.stringify(accents) : '';
  const extraKey = extra ? JSON.stringify(extra) : '';
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const el = typeof traced === 'function' ? traced() : traced?.current ?? null;
    const opts: Partial<FieldOptions> = {
      ...(PRESETS[preset] as Partial<FieldOptions>),
      ...(extraKey ? (JSON.parse(extraKey) as Partial<FieldOptions>) : {}),
      ...(sig ? { sig } : {}),
      ...(accent ? { accent } : {}),
      ...(accentsKey ? { accents: JSON.parse(accentsKey) } : {}),
    };
    if (el) {
      opts.mask = textMask(el, minSize);
      opts.plain = false;
      opts.onMask = (on) => {
        // 'off' rather than nothing, so text hidden while it waits for the field shows again.
        el.dataset.ko = on ? 'on' : 'off';
      };
    }
    if (formOnce && el) opts.form = claimFormation();
    const field = createField(c, opts);
    onField?.(field);
    return () => {
      field.destroy();
      if (el) delete el.dataset.ko;
      onField?.(null);
    };
    // onField and traced are read once, on mount, on purpose: the field lives as long as the canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, sig, accent, accentsKey, minSize, formOnce, extraKey]);
}
