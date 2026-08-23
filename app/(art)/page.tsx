import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { publicFileExists } from '@/lib/publicAssets';

const work = [
  {
    slug: 'stolarija-bm',
    url: 'stolarijabm.vercel.app',
    lift: true,
    name: 'Stolarija-BM',
    line: 'Catalogue and admin tools for a furniture workshop',
    tag: 'Client',
    stack: 'Next.js, TypeScript, Supabase',
    image: '/projects/stolarija-bm.png',
    href: '/work/stolarija-bm',
  },
  {
    slug: 'stocks-royale',
    url: 'stocks-royale.vercel.app',
    lift: true,
    name: 'Stocks Royale',
    line: 'A trading game running on simulated market data',
    tag: 'College',
    stack: 'Next.js, Node, PostgreSQL, Socket.io',
    image: '/projects/stocks-royale.png',
    href: '/work/stocks-royale',
  },
  {
    slug: 'pentix',
    url: 'pentix.eu',
    lift: false,
    name: 'Pentix',
    line: 'Counts push-up reps through your phone camera',
    tag: 'Personal',
    stack: 'Next.js, MediaPipe, Supabase',
    image: '/projects/pentix.png',
    href: '/work/pentix',
  },
  {
    slug: 'route-master',
    url: 'github.com/Brkic365/routeMaster',
    lift: true,
    name: 'RouteMaster',
    line: 'Traffic simulation and routing, written without libraries',
    tag: 'College',
    stack: 'Python, standard library only',
    image: '/projects/route-master.png',
    href: '/work/route-master',
  },
  {
    slug: 'runtime',
    url: 'runtime-rust.vercel.app',
    lift: true,
    name: 'Runtime',
    line: 'An API monitoring dashboard built in 24 hours',
    tag: 'Hackathon',
    stack: 'Next.js, TypeScript',
    image: '/projects/runtime.png',
    href: '/work/runtime',
  },
];

const archive: [string, string][] = [
  ['AI MotionMetrics', 'https://ai-motion-metrics.vercel.app/'],
  ['EBankc', 'https://ebankc.vercel.app/'],
  ['RocketWizard', 'https://rocket-wizard.vercel.app/'],
  ['Digital Era', 'https://www.the-digital-era.com/'],
  ['by Marro', 'https://bymarro.vercel.app/'],
  ['SiteBoost', 'https://site-boost.vercel.app/'],
  ['LuxuryPerspective', 'https://luxury-perspective.vercel.app/'],
  ['DreamFinders', 'https://dream-finders.vercel.app/'],
];

export default function Home() {
  const hasResume = publicFileExists('resume.pdf');

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────
          Exactly one viewport tall. `justify-between` spreads the three
          rows instead of stacking them from a fixed top offset, so the
          bottom row can never get pushed below the fold. svh rather than
          vh so mobile browser chrome doesn't cover it.                  */}
      <section
        className="art-pad flex flex-col justify-between"
        style={{
          minHeight: '100svh',
          paddingTop: 'clamp(2.5rem, 7vh, 5rem)',
          paddingBottom: 'clamp(2rem, 5vh, 3.5rem)',
        }}
      >
        <div className="art-mono art-enter flex justify-between" style={{ color: 'var(--ink-3)' }}>
          <span>Antonio Brkić</span>
          <span>Zagreb, HR</span>
        </div>

        <h1
          className="art-display art-enter art-enter-2"
          style={{ fontSize: 'clamp(3rem, 11vw, 11rem)', color: 'var(--ink)' }}
        >
          Antonio
          <br />
          Brkić
        </h1>

        <div className="art-enter art-enter-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <p
            className="art-serif"
            style={{
              fontSize: 'clamp(1.05rem, 1.9vw, 1.5rem)',
              lineHeight: 1.35,
              color: 'var(--ink-2)',
              maxWidth: '26ch',
            }}
          >
            Full-stack developer. I mostly build web apps that have to keep up
            with live data.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:contact@antoniobrkic.com"
              className="art-mono"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.95em 1.5em',
              }}
            >
              Get in touch
            </a>
            <span className="art-mono" style={{ color: 'var(--ink-3)' }}>
              Open to full-time
            </span>
          </div>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────────────────────────
          Rows animate individually, so the wrapper must not also move. */}
      <section data-no-reveal>
        {work.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <Link key={p.slug} href={p.href} className="block">
              <div
                className="art-band art-pad grid lg:grid-cols-2 items-center gap-x-14 gap-y-9 py-[9vh]"
                style={{ borderTop: '1px solid var(--rule)' }}
              >
                {/* Type and screenshot get separate columns. Never stacked. */}
                <div className={flip ? 'lg:order-2' : ''}>
                  <div
                    className="art-numeral mb-3"
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h2
                    className="art-display mb-4"
                    style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.75rem)', color: 'var(--ink)' }}
                  >
                    {p.name}
                  </h2>
                  <p
                    className="art-serif mb-6"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
                      color: 'var(--ink-2)',
                      maxWidth: '28ch',
                    }}
                  >
                    {p.line}
                  </p>
                  <div
                    className="art-mono flex flex-wrap gap-x-5 gap-y-1"
                    style={{ color: 'var(--ink-3)' }}
                  >
                    <span>{p.tag}</span>
                    <span>{p.stack}</span>
                  </div>
                </div>

                <div className={flip ? 'lg:order-1' : ''}>
                  <Shot src={p.image} alt={`${p.name} interface`} url={p.url} lift={p.lift} />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ── About ────────────────────────────────────────────────────
          Sits after the work on purpose. Anyone scanning gets the projects
          first; this is here for the people who kept reading.            */}
      <section
        className="art-pad py-[12vh] grid lg:grid-cols-[1fr_1.4fr] gap-x-16 gap-y-10"
        style={{ borderTop: '1px solid var(--rule)' }}
      >
        <div>
          <h2
            className="art-display mb-8"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', color: 'var(--ink)' }}
          >
            About
          </h2>
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6">
            {[
              ['Based in', 'Zagreb, Croatia'],
              ['Studying', 'Computer science at TVZ'],
              ['Working with', 'TypeScript, Next.js, Node, PostgreSQL, Python'],
              ['Right now', 'Open to full-time roles'],
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
        </div>

        <div
          className="art-serif"
          style={{
            fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
            lineHeight: 1.6,
            color: 'var(--ink-2)',
            maxWidth: '40rem',
          }}
        >
          <p>
            I build web apps, front to back. Most of what I actually know came
            from making things that had to work for someone other than me,
            whether that was a paying client, a course deadline or a group of
            friends who wanted to settle an argument.
          </p>
          <p style={{ marginTop: '1.2em' }}>
            The work I enjoy most has something moving in it. Prices arriving
            over a socket, a camera counting reps, traffic rerouting itself
            around a closed road. Those problems have a right answer you can
            measure, and they break in interesting ways when you get them wrong.
          </p>
          <p style={{ marginTop: '1.2em' }}>
            Day to day that means TypeScript, Next.js, Node and Postgres, with
            Python when the problem looks more like an algorithm than an app. I
            am comfortable owning something end to end, from the database up to
            the part a client has to be able to use without me sitting next to
            them.
          </p>
        </div>
      </section>

      {/* ── Archive ──────────────────────────────────────────────── */}
      <section className="art-pad py-[8vh]" style={{ borderTop: '1px solid var(--rule)' }}>
        <div className="art-mono mb-6" style={{ color: 'var(--ink-3)' }}>
          Older work
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {archive.map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="art-serif art-link"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', color: 'var(--ink-2)' }}
            >
              {name}
            </a>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <footer
        className="art-pad py-[10vh]"
        style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
      >
        <a
          href="mailto:contact@antoniobrkic.com"
          className="art-display block mb-[6vh]"
          style={{ fontSize: 'clamp(2rem, 8vw, 7rem)' }}
        >
          Say hello
        </a>
        <div className="art-mono flex flex-wrap gap-x-8 gap-y-2">
          <a href="https://github.com/Brkic365" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/antonio-brkic"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          {hasResume && <a href="/resume.pdf">Résumé</a>}
        </div>
      </footer>
    </main>
  );
}
