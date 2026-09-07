import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata: Metadata = {
  title: 'Tavola',
  description:
    'A restaurant menu that shows each dish in AR at true scale, so guests can see the real portion size before they order. Next.js, Prisma and model-viewer.',
  alternates: { canonical: '/work/tavola' },
};

const theme = projectThemes.tavola;

const steps: [string, string][] = [
  ['Scan the table code', 'A QR code on the table opens the menu. Nothing to install.'],
  ['Tap a dish', 'The menu is plain and mobile-first, with the portion facts on the card itself.'],
  [
    'See it at true size',
    'The dish appears on the table in front of you at real-world scale, through the phone camera.',
  ],
];

export default function TavolaPage() {
  const hasShot = publicFileExists('projects/tavola.png');

  return (
    <div className="art" data-theme="tavola" style={themeVars(theme)}>
      <main>
        <section className="art-pad pt-[18vh] pb-[8vh]">
          <div className="art-mono mb-6" style={{ color: 'var(--accent)' }}>
            Personal project, live at tavola-menu.vercel.app
          </div>
          <h1
            className="art-display art-enter art-enter-2"
            style={{ fontSize: 'clamp(3rem, 15vw, 15rem)', color: 'var(--ink)' }}
          >
            Tavola
          </h1>
          <div
            className="mt-10 flex flex-wrap items-end justify-between gap-8"
          >
            <p
              className="art-serif"
              style={{
                fontSize: 'clamp(1.15rem, 2.4vw, 1.9rem)',
                lineHeight: 1.3,
                color: 'var(--ink-2)',
                maxWidth: '30ch',
              }}
            >
              A menu that shows you how big the dish actually is, before you
              order it.
            </p>
            <a
              href="https://tavola-menu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="art-mono"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.9em 1.4em',
              }}
            >
              Open it
            </a>
          </div>
        </section>

        {hasShot && (
          <section className="art-pad pb-[10vh]">
            <Shot
              src="/projects/tavola.png"
              alt="The Tavola menu and dish viewer"
              url="tavola"
              ratio="16 / 9"
              sizes="(max-width: 1024px) 92vw, 82vw"
            />
          </section>
        )}

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
              The interesting part is not the AR. It is portion transparency.
              Menu photography is shot to flatter, so the gap between the picture
              and the plate is where complaints come from. If a guest can see the
              real size, weight and how many people it serves before ordering,
              that argument does not happen.
            </p>
          </div>
        </section>

        <section
          className="art-pad py-[10vh] grid md:grid-cols-3 gap-x-10 gap-y-12"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          {steps.map(([title, body], i) => (
            <div key={title}>
              <div
                className="art-display mb-5"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', color: 'var(--accent)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h2
                className="art-display mb-3"
                style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', color: 'var(--ink)' }}
              >
                {title}
              </h2>
              <p
                className="art-serif"
                style={{ fontSize: '1.05rem', lineHeight: 1.55, color: 'var(--ink-2)' }}
              >
                {body}
              </p>
            </div>
          ))}
        </section>

        <section className="art-pad py-[10vh] grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-20">
          <div
            className="art-serif"
            style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
          >
            <p>
              It is a full app rather than a demo page. Restaurants sign in, add
              and reorder dishes, upload the models, and print a QR code per
              table. Every AR launch is recorded, which is the number that tells
              you whether guests actually use it or just tap once out of
              curiosity.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              The AR itself leans on <code>model-viewer</code>, which hands off to
              Scene Viewer on Android and Quick Look on iOS. That was a
              deliberate choice over building the viewer myself. Native handoff
              gets accurate real-world scale and lighting for free, and on a
              phone at a dinner table that matters more than control over the
              render.
            </p>
            <p
              className="art-mono mt-8"
              style={{
                color: 'var(--accent)',
                border: '1px solid var(--rule)',
                padding: '1rem 1.2rem',
                lineHeight: 1.7,
              }}
            >
              Heads up: it runs on demo data. The dishes are examples and the
              models are stand-ins rather than real scanned food, so treat the
              portions as a demonstration of the idea.
            </p>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6 self-start">
            {[
              ['Built with', 'Next.js, TypeScript, Tailwind'],
              ['Data', 'Prisma, PostgreSQL'],
              ['3D and AR', 'model-viewer, Scene Viewer, Quick Look'],
              ['Role', 'Sole developer'],
              ['Live at', 'tavola-menu.vercel.app', 'https://tavola-menu.vercel.app/'],
              ['Source', 'github.com/Brkic365/tavola', 'https://github.com/Brkic365/tavola'],
            ].map(([k, v, href]) => (
              <div key={k}>
                <dt className="art-mono mb-1" style={{ color: 'var(--ink-3)' }}>
                  {k}
                </dt>
                <dd className="art-serif" style={{ color: 'var(--ink)' }}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="art-link">
                      {v}
                    </a>
                  ) : (
                    v
                  )}
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
            href="/work/pentix"
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: 'var(--ink)' }}
          >
            Pentix
          </Link>
        </nav>
      </main>
    </div>
  );
}
