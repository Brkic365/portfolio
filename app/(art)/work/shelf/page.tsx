import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata: Metadata = {
  title: 'Shelf',
  description:
    'Tell it which bottles you own and it works out what you can pour tonight, then which single bottle would unlock the most new drinks.',
  alternates: { canonical: '/work/shelf' },
};

const theme = projectThemes.shelf;

export default function ShelfPage() {
  const hasShot = publicFileExists('projects/cocktailshelf.png');

  return (
    <div className="art" data-theme="shelf" style={themeVars(theme)}>
      <main>
        <section className="art-pad pt-[18vh] pb-[8vh]">
          <div className="art-mono mb-6" style={{ color: 'var(--accent)' }}>
            Personal project
          </div>
          <h1
            className="art-display art-enter art-enter-2"
            style={{ fontSize: 'clamp(3.5rem, 16vw, 16rem)', color: 'var(--ink)' }}
          >
            Shelf
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
                maxWidth: '30ch',
              }}
            >
              What you can pour from the bottles you already own, and which one
              more would change the most.
            </p>
            <a
              href="https://cocktailshelf.vercel.app/"
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
              src="/projects/cocktailshelf.png"
              alt="The Shelf ingredient picker and drink count"
              url="cocktailshelf.vercel.app"
              lift
              priority
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
              Recipe sites answer the wrong question. They tell you how to make a
              drink you have already chosen, then send you to a shop. The
              question people actually have is the reverse one: given what is
              already on the shelf, what can I make tonight without going
              anywhere.
            </p>
          </div>
        </section>

        <section
          className="art-pad py-[10vh] grid md:grid-cols-2 gap-x-12 gap-y-12"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <div>
            <div className="art-mono mb-4" style={{ color: 'var(--accent)' }}>
              Question one
            </div>
            <h2
              className="art-display mb-4"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--ink)' }}
            >
              What can I pour right now?
            </h2>
            <p
              className="art-serif"
              style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--ink-2)' }}
            >
              Tick the bottles you own and the count updates as you go. Water and
              ice are treated as implied rather than something you have to
              declare, and a loose mode lets near-enough substitutions count, so
              a recipe calling for gold rum is not blocked by owning white.
            </p>
          </div>
          <div>
            <div className="art-mono mb-4" style={{ color: 'var(--accent)' }}>
              Question two
            </div>
            <h2
              className="art-display mb-4"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--ink)' }}
            >
              What should I buy next?
            </h2>
            <p
              className="art-serif"
              style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--ink-2)' }}
            >
              This is the one worth building. For every bottle you do not own,
              work out how many drinks it would unlock given everything you do,
              then rank them. The answer changes completely depending on what is
              already there, which is why a generic list of essentials is never
              much use to anyone.
            </p>
          </div>
        </section>

        <section className="art-pad py-[10vh] grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-20">
          <div
            className="art-serif"
            style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
          >
            <p>
              Most of the difficulty is in the data rather than the maths. Recipe
              sources name the same thing a dozen ways, so the ingredient list
              has to be normalised into a single vocabulary before any of the
              counting means anything. Get that wrong and the answers are
              confidently incorrect, which is worse than no answer.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              Everything is shareable by link, so a shelf can be sent to someone
              else without an account or a login.
            </p>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6 self-start">
            {[
              ['Built with', 'Next.js, TypeScript'],
              ['Role', 'Sole developer'],
              ['Live at', 'cocktailshelf.vercel.app', 'https://cocktailshelf.vercel.app/'],
              ['Source', 'Private for now'],
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
            href="/work/route-master"
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: 'var(--ink)' }}
          >
            RouteMaster
          </Link>
        </nav>
      </main>
    </div>
  );
}
