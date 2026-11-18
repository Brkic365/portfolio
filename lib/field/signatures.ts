/**
 * Flow signatures: the behaviour a field takes on for one project.
 *
 * Every field blends between these. `curl` is the default for the site; each
 * project has its own, so hovering a project in the gallery (or opening its
 * case study) turns the same particles into that project's motion.
 *
 * The colour is not stored here. It belongs to the project, in
 * `data/projects.ts`, and is handed to the field with the signature. This file
 * only describes how the trails behave, so it imports nothing and can be read
 * from server code.
 */

export const SIGNATURES = {
  /** Site default: curl noise, divergence-free, so trails swirl instead of clumping. */
  curl: { tint: 0, fade: 1, about: 'Curl noise' },
  /** Vectra XR: concentric ellipses, as if seen around a turntable. */
  orbit: { tint: 0.4, fade: 0.7, about: 'A turntable orbit' },
  /** Stolarija-BM: long parallel lines whose neighbours share a waver, like grain. */
  grain: { tint: 0.35, fade: 0.45, about: 'Wood grain' },
  /** Tavola: a slow, warm swirl around the middle. */
  swirl: { tint: 0.22, fade: 0.9, about: 'A slow swirl' },
  /** Pentix: breathes out and in about once a second, like reps. */
  pulse: { tint: 0.42, fade: 1.15, about: 'One rep a second' },
  /** Shelf: bubbles rising and wobbling. */
  bubble: { tint: 0.5, fade: 0.8, about: 'Rising bubbles' },
  /** RouteMaster: travel along a street grid, turning at intersections. */
  grid: { tint: 0.62, fade: 0.5, about: 'A street grid' },
  /** Runtime: a fast horizontal stream that jumps where the graph spikes. */
  stream: { tint: 0.4, fade: 0.55, about: 'A monitoring graph' },
  /** Stocks Royale: price ticks, flat runs broken by sudden jumps. */
  tick: { tint: 0.5, fade: 0.6, about: 'Price ticks' },
} as const;

export type Signature = keyof typeof SIGNATURES;

export const SIGNATURE_KEYS = Object.keys(SIGNATURES) as Signature[];

/** The site's own accent, used by the curl signature unless a page overrides it. */
export const HOT = '#ff5a1f';
