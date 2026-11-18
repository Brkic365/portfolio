'use client';

import type { FieldHandle } from './engine';
import { HOT, type Signature } from './signatures';

/**
 * The site-wide background field, as a handle anything on the page can reach:
 * the gallery morphs it on hover and bursts it on click, and a case study sets
 * its own signature and accent as the page's resting state.
 *
 * `Backdrop` registers the handle. A page can set its signature before that
 * happens (child effects run before the layout's), so the resting state is
 * kept here and read when the field is created.
 */

let handle: FieldHandle | null = null;
let rest: { sig: Signature; accent: string } = { sig: 'curl', accent: HOT };

export function setBackdrop(h: FieldHandle | null) {
  handle = h;
}

export function backdrop(): FieldHandle | null {
  return handle;
}

/** The page's own signature, which the backdrop returns to after a hover. */
export function restingSignature() {
  return rest;
}

export function setRestingSignature(sig: Signature, accent: string) {
  rest = { sig, accent };
  handle?.morph(sig, accent);
}

/** Back to the page's own signature. */
export function restBackdrop() {
  handle?.morph(rest.sig, rest.accent);
}
