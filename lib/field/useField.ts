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
  /** Assemble the traced text out of scattered particles, once per browser session. */
  formOnce?: boolean;
  /** Handed the field once it exists, and null when it goes away. */
  onField?: (field: FieldHandle | null) => void;
}

const FORMED_KEY = 'field-formed';

/** Whether this visit should play the formation pass. Records that it has. */
function claimFormation(): boolean {
  if (prefersReducedMotion()) return false;
  try {
    if (sessionStorage.getItem(FORMED_KEY)) return false;
    sessionStorage.setItem(FORMED_KEY, '1');
  } catch {
    // Storage blocked (private mode, sandboxed preview): skip the flourish rather than replay it on every load.
    return false;
  }
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
        if (on) el.dataset.ko = 'on';
        else delete el.dataset.ko;
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
