import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata: Metadata = {
  title: 'Vectra XR',
  description:
    'Co-founder and CEO of Vectra XR, a 3D product configurator with WebAR for manufacturers selling custom hardware and prefab homes.',
  alternates: { canonical: '/work/vectraxr' },
};

const theme = projectThemes.vectraxr;

const verticals: [string, string, string, string][] = [
  [
    'Fitness',
    'Sell the rack, not the spec sheet.',
    'Customers configure a rack or rig, pick attachments, watch dimensions update, then point a phone at their garage and see it at full scale. The system blocks combinations that will not ship.',
    'demo.vectraxr.com',
  ],
  [
    'Properties',
    'Sell the home before it is built.',
    'Buyers explore a prefab home in 3D before construction starts. Each prospect gets a private link to their own version, with the finishes and layout they chose, on any device.',
    'casademo.vectraxr.com',
  ],
];

export default function VectraXRPage() {
  const hasShot = publicFileExists('projects/vectraxr.png');

  return (
    <div className="art" data-theme="vectraxr" style={themeVars(theme)}>
      <main>
        <section className="art-pad pt-[16vh] pb-[8vh]">
          <div className="art-mono mb-6">
            <span
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.45em 0.8em',
                display: 'inline-block',
              }}
            >
              Co-founder and CEO
            </span>
          </div>
          <h1
            className="art-display art-enter art-enter-2"
            style={{ fontSize: 'clamp(2.8rem, 12vw, 12rem)', color: 'var(--ink)' }}
          >
            Vectra XR
          </h1>
          <div
            className="mt-[6vh] flex flex-wrap items-end justify-between gap-8"
            style={{ borderTop: '2px solid var(--accent)', paddingTop: '2rem' }}
          >
            <p
              className="art-serif"
              style={{
                fontSize: 'clamp(1.15rem, 2.4vw, 1.9rem)',
                lineHeight: 1.3,
                color: 'var(--ink)',
                maxWidth: '28ch',
              }}
            >
              A 3D configurator for products people buy before they exist.
            </p>
            <a
              href="https://vectraxr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="art-mono"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.9em 1.4em',
              }}
            >
              Visit vectraxr.com
            </a>
          </div>
        </section>

        {hasShot && (
          <section className="art-pad pb-[10vh]">
            <Shot
              src="/projects/vectraxr.png"
              alt="The Vectra XR configurator"
              url="vectraxr.com"
              priority
              ratio="16 / 9"
              sizes="(max-width: 1024px) 92vw, 82vw"
            />
          </section>
        )}

        {/* ── The problem, in one block ─────────────────────────────── */}
        <section
          className="art-pad py-[10vh]"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <div
            className="art-serif"
            style={{
              fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
              lineHeight: 1.55,
              color: 'var(--ink-2)',
              maxWidth: '44rem',
            }}
          >
            <p>
              Static photos do not close five-figure decisions. When someone is
              about to commit to a custom rig, or to the home they will live in
              for the next decade, they need to see their configuration, in their
              space, at full scale. Most manufacturers still sell that with
              photoshoots that go stale and PDF spec sheets that come back with
              the same questions every time.
            </p>
          </div>
        </section>

        {/* ── Two verticals ────────────────────────────────────────── */}
        <section
          className="art-pad py-[10vh] grid md:grid-cols-2 gap-x-12 gap-y-14"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          {verticals.map(([label, headline, body, demo]) => (
            <div key={label}>
              <div className="art-mono mb-4" style={{ color: 'var(--accent)' }}>
                {label}
              </div>
              <h2
                className="art-display mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--ink)' }}
              >
                {headline}
              </h2>
              <p
                className="art-serif mb-5"
                style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--ink-2)' }}
              >
                {body}
              </p>
              <a
                href={`https://${demo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="art-mono art-link"
                style={{ color: 'var(--ink)' }}
              >
                Try the live configurator
              </a>
            </div>
          ))}
        </section>

        {/* ── Facts ─────────────────────────────────────────────────── */}
        <section
          className="art-pad py-[8vh]"
          style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}
        >
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {[
              ['Role', 'Co-founder and CEO'],
              ['I own', 'Product direction and 3D engineering'],
              ['Team', 'Three founders, no outside investors'],
              ['Runs in', 'The browser. No app, no headset'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="art-mono mb-2" style={{ color: 'var(--ink-3)' }}>
                  {k}
                </dt>
                <dd className="art-serif" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="art-pad py-[10vh] grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-20">
          <div
            className="art-serif"
            style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
          >
            <p>
              The whole thing has to run in a browser tab on a phone a customer
              already owns. That constraint decides most of the engineering.
              Every product is one 3D model with variants generated on demand
              rather than a model per combination, and the assets have to be
              light enough to load over mobile data while still looking like the
              thing someone is about to spend five figures on.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              It also has to drop into someone else&rsquo;s storefront. The
              configurator embeds into Shopify, WooCommerce or Webflow with a
              single tag, so it has to behave inside a page it does not control.
            </p>
          </div>
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6 self-start">
            {[
              ['Marketing site', 'Next.js on Vercel'],
              ['Configurator', 'WebGL in the browser'],
              ['Placement', 'WebAR, fitness vertical'],
              ['Based in', 'Zagreb, Croatia'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="art-mono mb-1" style={{ color: 'var(--ink-3)' }}>
                  {k}
                </dt>
                <dd className="art-serif" style={{ color: 'var(--ink)' }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <nav
          className="art-pad py-[8vh] flex flex-wrap items-baseline justify-between gap-6"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <Link href="/" className="art-mono" style={{ color: 'var(--ink-3)' }}>
            Back to index
          </Link>
          <Link
            href="/work/stolarija-bm"
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: 'var(--ink)' }}
          >
            Stolarija-BM
          </Link>
        </nav>
      </main>
    </div>
  );
}
