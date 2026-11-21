import type { Signature } from '@/lib/field/signatures';

/**
 * Every project with a case study, in gallery order. The homepage gallery,
 * the case study heroes, the next-project chain, the sitemap and the social
 * cards all read from here.
 *
 * `accent` is the project's colour on the dark Field background. It tints the
 * project's signature in the gallery and replaces the site's orange on its
 * case study. Each one is checked against #0e0e10 for at least 4.5:1, since it
 * also colours small text (kickers, step numbers, the crumb).
 */
export interface Project {
  slug: string;
  name: string;
  /** One line, used in the gallery and on the next-project link. */
  line: string;
  /** Short role tag: Co-founder, Client, Personal, College, Hackathon. */
  tag: string;
  /** Longer role for the gallery meta line. */
  role: string;
  stack: string;
  /** Live address, shown without the protocol. */
  url: string;
  /** Label for `url` in the meta row: Live, or Source when it is a repository. */
  urlLabel: 'Live' | 'Source';
  image: string;
  /** Pixel size of `image`, so frames reserve the right space. */
  size: [number, number];
  /** Very dark screenshot that needs the shadow lift. Set from measured luminance, not by eye. */
  lift: boolean;
  sig: Signature;
  accent: string;
  /** In the homepage gallery and the next-project chain. The rest live under More work. */
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'vectraxr',
    name: 'Vectra XR',
    line: '3D configurators for things that are built to order',
    tag: 'Co-founder',
    role: 'Co-founder, Dec 2025 to now',
    stack: 'Turborepo, Next.js, Prisma',
    url: 'vectraxr.com',
    urlLabel: 'Live',
    image: '/projects/vectraxr.png',
    size: [2551, 1335],
    lift: false,
    sig: 'orbit',
    accent: '#6f9bd1',
    featured: true,
  },
  {
    slug: 'bura',
    name: 'Bura',
    line: 'Live wind over the Croatian coast, drawn as a particle field',
    tag: 'Personal',
    role: 'Personal, November 2026',
    stack: 'TypeScript, WebGL2, Vercel',
    url: 'bura-fawn.vercel.app',
    urlLabel: 'Live',
    image: '/projects/bura.jpg',
    size: [2000, 1250],
    lift: true,
    sig: 'wind',
    accent: '#8fd3ee',
    featured: true,
  },
  {
    slug: 'stolarija-bm',
    name: 'Stolarija-BM',
    line: 'Catalogue and admin tools for a furniture workshop',
    tag: 'Client',
    role: 'Client',
    stack: 'Next.js, TypeScript, Supabase',
    url: 'stolarijabm.vercel.app',
    urlLabel: 'Live',
    image: '/projects/stolarija-bm.png',
    size: [2326, 1259],
    lift: true,
    sig: 'grain',
    accent: '#c06a3a',
    featured: true,
  },
  {
    slug: 'tavola',
    name: 'Tavola',
    line: 'Restaurant menus that show a dish at true size in AR',
    tag: 'Personal',
    role: 'Personal',
    stack: 'Next.js, Prisma, model-viewer',
    url: 'tavola-menu.vercel.app',
    urlLabel: 'Live',
    image: '/projects/tavola.png',
    size: [2527, 1207],
    lift: false,
    sig: 'swirl',
    accent: '#14917f',
    featured: false,
  },
  {
    slug: 'route-master',
    name: 'RouteMaster',
    line: 'Traffic simulation and routing, written without libraries',
    tag: 'College',
    role: 'College',
    stack: 'Python, standard library only',
    url: 'github.com/Brkic365/routeMaster',
    urlLabel: 'Source',
    image: '/projects/route-master.png',
    size: [1805, 1383],
    lift: true,
    sig: 'grid',
    accent: '#4fc3ff',
    featured: false,
  },
  {
    slug: 'runtime',
    name: 'Runtime',
    line: 'An API monitoring dashboard built in 24 hours',
    tag: 'Hackathon',
    role: 'Hackathon',
    stack: 'Next.js, TypeScript',
    url: 'runtime-rust.vercel.app',
    urlLabel: 'Live',
    image: '/projects/runtime.png',
    size: [2394, 1330],
    lift: true,
    sig: 'stream',
    accent: '#2fb5a3',
    featured: false,
  },
  {
    slug: 'sada',
    name: 'Sada',
    line: 'The nearest café in the sun, worked out from the city in 3D',
    tag: 'Hackathon',
    role: 'Zagreb Hackathon, with Marko Livaic',
    stack: 'Next.js, Mapbox GL, Web Workers',
    url: 'sada-hackathon.vercel.app',
    urlLabel: 'Live',
    image: '/projects/sada.png',
    size: [2542, 1336],
    lift: false,
    sig: 'sun',
    accent: '#f2b330',
    featured: true,
  },
];

export const featured = projects.filter((p) => p.featured);

export function getProject(slug: string): Project {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project: ${slug}`);
  return p;
}

/** Position in the gallery, 1-based, or null for projects outside it. */
export function galleryIndex(slug: string): number | null {
  const i = featured.findIndex((p) => p.slug === slug);
  return i < 0 ? null : i + 1;
}

/** The next case study in the chain. It wraps, so the last leads back to the first. */
export function nextProject(slug: string): Project | null {
  const i = featured.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return featured[(i + 1) % featured.length];
}

/** Signature to accent, for the gallery field that morphs between projects. */
export const signatureAccents = Object.fromEntries(projects.map((p) => [p.sig, p.accent])) as Partial<
  Record<Signature, string>
>;

export interface MoreItem {
  name: string;
  note: string;
  href: string;
  /** True when the link goes to a page here rather than off-site. */
  internal?: boolean;
}

export const more: MoreItem[] = [
  // These keep their full pages but sit outside the gallery.
  { name: 'Tavola', note: 'Restaurant menus that show a dish at true size in AR', href: '/work/tavola', internal: true },
  { name: 'RouteMaster', note: 'Traffic simulation and routing in plain Python, for college', href: '/work/route-master', internal: true },
  { name: 'Runtime', note: 'An API monitoring dashboard built at a 24-hour hackathon', href: '/work/runtime', internal: true },
  // Client sites.
  { name: 'RocketWizard', note: 'Copy-trading SaaS with crypto billing, for a client', href: 'https://rocket-wizard.vercel.app/' },
  { name: 'Digital Era', note: 'Marketing site for a consultancy', href: 'https://www.the-digital-era.com/' },
  { name: 'by Marro', note: 'Portfolio for a freelance photographer', href: 'https://bymarro.vercel.app/' },
];
