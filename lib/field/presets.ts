import type { FieldOptions } from './engine';

/**
 * Named tunings, so server components can ask for a field by role
 * (`preset="band"`) without passing functions or long option objects across
 * the client boundary. Values come straight from the approved prototype.
 */
export const PRESETS = {
  /**
   * The one field behind every page: fixed, viewport-sized, plain. It is
   * brighter near the top of a page, where it stands in for the hero's field,
   * and settles to `outside` below. See `components/field/Backdrop.tsx`.
   */
  backdrop: {
    plain: true, density: 300, maxN: 4400, maxNarrow: 900, speed: 1.1, drift: 0.2, tStep: 0.0013,
    fade: 0.045, outside: 0.3, share: 0.08, light: 0.8, life: [80, 240], dprMax: 1.25, warm: 120,
    still: 220, push: 1.8, swirl: 2.2,
  },
  /*
   * Knockouts draw only inside their letters (outside: 0), so they sit on the
   * backdrop with no rectangle around them. Nearly every respawn lands inside
   * the letters, since particles anywhere else are never seen.
   */
  /** The homepage hero: dense, bright, the name traced large. */
  hero: { outside: 0, spawnIn: 0.9, maxN: 3600, maxNarrow: 1000 },
  /** A case study hero: the homepage field, calmer, behind the project name. */
  case: {
    share: 0.09, density: 300, maxN: 2600, maxNarrow: 900, speed: 1.05, drift: 0.14, light: 0.9,
    scale: 0.0013, tStep: 0.0009, fade: 0.035, outside: 0, fill: 0.035, life: [80, 260], warm: 60,
    still: 260, push: 1.6, swirl: 2, spawnIn: 0.9,
  },
  /** Section headings: quieter knockouts. */
  quiet: {
    density: 220, maxN: 2200, maxNarrow: 900, speed: 1, tStep: 0.0012, fade: 0.05, outside: 0,
    fill: 0.1, light: 0.9, spawnIn: 0.95, life: [50, 160], dprMax: 1.25, warm: 90, still: 200,
    push: 1.6, swirl: 2, share: 0.08,
  },
  /** Project names in the gallery: a little more colour. */
  name: {
    density: 220, maxN: 2200, maxNarrow: 900, speed: 1, tStep: 0.0012, fade: 0.05, outside: 0,
    fill: 0.1, light: 0.9, spawnIn: 0.95, life: [50, 160], dprMax: 1.25, warm: 90, still: 200,
    push: 1.6, swirl: 2, share: 0.22,
  },
  /** The email in the footer. */
  mail: {
    density: 220, maxN: 2200, maxNarrow: 900, speed: 1, tStep: 0.0012, fade: 0.05, outside: 0,
    fill: 0.14, light: 0.9, spawnIn: 0.95, life: [50, 160], dprMax: 1.25, warm: 90, still: 200,
    push: 1.6, swirl: 2, share: 0.32,
  },
} satisfies Record<string, Partial<FieldOptions>>;

export type Preset = keyof typeof PRESETS;
