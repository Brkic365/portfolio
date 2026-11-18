import type { Metadata } from 'next';
import { publicFileExists } from './publicAssets';

export const SITE_URL = 'https://antoniobrkic.com';
export const SITE_NAME = 'Antonio Brkić';

/**
 * The social card for a page. Cards are rendered by `scripts/og.mjs` and
 * committed to /public/og. A page without its own card falls back to the
 * homepage card, and if even that is missing there is simply no image rather
 * than a broken one.
 */
export function ogImage(card: string, alt: string) {
  const file = publicFileExists(`og/${card}.png`)
    ? `og/${card}.png`
    : publicFileExists('og/home.png')
      ? 'og/home.png'
      : null;
  return file ? [{ url: `/${file}`, width: 1200, height: 630, alt }] : undefined;
}

/**
 * Full metadata for one page. Next merges metadata shallowly, so a page that
 * sets openGraph replaces the layout's openGraph entirely; building it here
 * keeps every page's card, canonical URL and description consistent.
 */
export function pageMetadata({
  title,
  description,
  path,
  card,
  type = 'website',
}: {
  /** Page title. Undefined uses the layout default. */
  title?: string;
  description: string;
  path: string;
  /** Social card name in /public/og, without extension. */
  card: string;
  type?: 'website' | 'article';
}): Metadata {
  const full = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME}, Full-Stack Developer`;
  const images = ogImage(card, title ? `${title}, a project by ${SITE_NAME}` : `${SITE_NAME}, full-stack developer in Zagreb`);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: `${SITE_URL}${path === '/' ? '' : path}`,
      siteName: SITE_NAME,
      title: full,
      description,
      locale: 'en_US',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: full,
      description,
      images: images?.map((i) => i.url),
    },
  };
}
