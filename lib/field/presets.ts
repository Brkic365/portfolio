import type { FieldOptions } from './engine';

/**
 * Named tunings, so server components can ask for a field by role
 * (`preset="band"`) without passing functions or long option objects across
 * the client boundary. Values come straight from the approved prototype.
 */
export const PRESETS = {
  /** The homepage hero: dense, bright, the name traced large. */
  hero: {},
  /** A case study hero: the homepage field, calmer, behind the project name. */
  case: {
    share: 0.09, density: 300, maxN: 3800, maxNarrow: 1100, speed: 1.05, drift: 0.14, light: 0.9,
    scale: 0.0013, tStep: 0.0009, fade: 0.035, outside: 0.1, fill: 0.035, life: [80, 260], warm: 60,
    still: 260, push: 1.6, swirl: 2,
  },
  /** Section headings: quieter knockouts. */
  quiet: {
    density: 220, maxN: 2200, maxNarrow: 900, speed: 1, tStep: 0.0012, fade: 0.05, outside: 0.07,
    fill: 0.1, light: 0.9, spawnIn: 0.85, life: [50, 160], dprMax: 1.25, warm: 90, still: 200,
    push: 1.6, swirl: 2, share: 0.08,
  },
  /** Project names in the gallery: a little more colour, a little more spill. */
  name: {
    density: 220, maxN: 2200, maxNarrow: 900, speed: 1, tStep: 0.0012, fade: 0.05, outside: 0.2,
    fill: 0.1, light: 0.9, spawnIn: 0.85, life: [50, 160], dprMax: 1.25, warm: 90, still: 200,
    push: 1.6, swirl: 2, share: 0.22,
  },
  /** The email in the footer. */
  mail: {
    density: 220, maxN: 2200, maxNarrow: 900, speed: 1, tStep: 0.0012, fade: 0.05, outside: 0.07,
    fill: 0.14, light: 0.9, spawnIn: 0.85, life: [50, 160], dprMax: 1.25, warm: 90, still: 200,
    push: 1.6, swirl: 2, share: 0.32,
  },
  /** Thin bands between sections. */
  band: {
    plain: true, density: 380, maxN: 520, maxNarrow: 180, speed: 1, drift: 0.35, tStep: 0.0012,
    fade: 0.05, outside: 0.5, share: 0.06, life: [60, 200], dprMax: 1.25, warm: 120, still: 200,
  },
  /** The gallery's own field, behind the panels. It takes on each project's signature. */
  gallery: {
    plain: true, density: 300, maxN: 4200, maxNarrow: 0, speed: 1.05, drift: 0.2, tStep: 0.0012,
    fade: 0.045, outside: 0.34, share: 0.3, light: 0.6, life: [80, 240], dprMax: 1.25, warm: 120,
    still: 220, push: 1.8, swirl: 2.2,
  },
} satisfies Record<string, Partial<FieldOptions>>;

export type Preset = keyof typeof PRESETS;
