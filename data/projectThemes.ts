/**
 * Per-project art direction for /v3.
 *
 * Each project page commits to one palette rather than following the system
 * theme — the commitment is the point. Applied as inline CSS variables on the
 * page root, overriding the neutral defaults in `.art`.
 */

export interface ProjectTheme {
    /** Page background. */
    bg: string;
    /** Primary text. */
    ink: string;
    /** Secondary text — must clear 4.5:1 against bg. */
    ink2: string;
    /** Tertiary text and captions — must clear 4.5:1 against bg. */
    ink3: string;
    /** Hairlines and borders. */
    rule: string;
    /** Spot colour: image tint, kickers, emphasis. */
    accent: string;
    /** Text placed on top of the accent. */
    onAccent: string;
}

export const projectThemes: Record<string, ProjectTheme> = {
    /** Warm oak and cream — the workshop's own materials. */
    'stolarija-bm': {
        bg: '#f2ece1',
        ink: '#241a10',
        ink2: '#57452f',
        ink3: '#6b5840',
        rule: '#d8cab4',
        accent: '#8a4520',
        onAccent: '#f7f2e9',
    },
    /** Terminal green on near-black — a trading screen. */
    'stocks-royale': {
        bg: '#0a0d0b',
        ink: '#e9f4ed',
        ink2: '#9db3a6',
        ink3: '#8aa294',
        rule: '#1d2a23',
        accent: '#3fd680',
        onAccent: '#06120c',
    },
    /** Cool white and electric violet — competitive, athletic, sharp. */
    pentix: {
        bg: '#eff1f4',
        ink: '#0e0f14',
        ink2: '#484b56',
        ink3: '#5c5f6a',
        rule: '#d4d7de',
        accent: '#4b2ee0',
        onAccent: '#ffffff',
    },
    /** Blueprint navy and cyan — drafting table for a road network. */
    'route-master': {
        bg: '#091019',
        ink: '#e6eef7',
        ink2: '#93a6bb',
        ink3: '#8497ae',
        rule: '#1a2736',
        accent: '#4fc3ff',
        onAccent: '#04101c',
    },
    /** Pale instrument panel and deep teal — quiet, measured, legible. */
    runtime: {
        bg: '#f1f4f3',
        ink: '#0f1514',
        ink2: '#434f4c',
        ink3: '#576461',
        rule: '#d2dad7',
        accent: '#0c6b60',
        onAccent: '#f4f7f6',
    },
};

/** Inline style object applying a theme's variables to a page root. */
export function themeVars(theme: ProjectTheme): React.CSSProperties {
    return {
        '--bg': theme.bg,
        '--ink': theme.ink,
        '--ink-2': theme.ink2,
        '--ink-3': theme.ink3,
        '--rule': theme.rule,
        '--accent': theme.accent,
        '--on-accent': theme.onAccent,
    } as React.CSSProperties;
}
