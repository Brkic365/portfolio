import Link from 'next/link';
import Image from 'next/image';
import Shot from '@/components/art/Shot';
import { publicFileExists } from '@/lib/publicAssets';

const work = [
  {
    slug: 'vectraxr',
    url: 'vectraxr.com',
    lift: false,
    name: 'Vectra XR',
    line: '3D configurators for things that are built to order',
    tag: 'Co-founder',
    stack: 'Turborepo, Next.js, Prisma',
    image: '/projects/vectraxr.png',
    href: '/work/vectraxr',
  },
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
    slug: 'tavola',
    url: 'tavola-menu.vercel.app',
    lift: false,
    name: 'Tavola',
    line: 'Restaurant menus that show a dish at true size in AR',
    tag: 'Personal',
    stack: 'Next.js, Prisma, model-viewer',
    image: '/projects/tavola.png',
    href: '/work/tavola',
  },
  {
    slug: 'pentix',
    url: 'pentix.eu',
    lift: true,
    name: 'Pentix',
    line: 'Counts push-up reps through your phone camera',
    tag: 'Personal',
    stack: 'Next.js, MediaPipe, Supabase',
    image: '/projects/pentix.png',
    href: '/work/pentix',
  },
  {
    slug: 'shelf',
    url: 'cocktailshelf.vercel.app',
    lift: true,
    name: 'Shelf',
    line: 'What you can pour from the bottles you already own',
    tag: 'Personal',
    stack: 'Next.js, TypeScript',
    image: '/projects/cocktailshelf.png',
    href: '/work/shelf',
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

interface MoreItem {
  name: string;
  note: string;
  href: string;
  /** True when the link goes to a project page here rather than off-site. */
  internal?: boolean;
  image?: string;
  /** Set from measured mean luminance, not by eye. */
  lift?: boolean;
}

const more: MoreItem[] = [
  // Kept its full page; it just no longer earns a slot in the main list.
  {
    name: 'Stocks Royale',
    note: 'A trading game on simulated market data',
    href: '/work/stocks-royale',
    internal: true,
    image: '/projects/stocks-royale.png',
    lift: true,
  },
  {
    name: 'AI MotionMetrics',
    note: 'Rep tracking in the browser with TensorFlow.js',
    href: 'https://ai-motion-metrics.vercel.app/',
  },
  {
    name: 'EBankc',
    note: 'A decentralised finance banking concept',
    href: 'https://ebankc.vercel.app/',
    image: '/projects/ebankc.png',
  },
  {
    name: 'RocketWizard',
    note: 'Copy-trading SaaS with crypto billing',
    href: 'https://rocket-wizard.vercel.app/',
    image: '/projects/rocketwizard.png',
  },
  {
    name: 'Digital Era',
    note: 'Marketing site for a consultancy',
    href: 'https://www.the-digital-era.com/',
    image: '/projects/digital-era.png',
  },
  {
    name: 'by Marro',
    note: 'Portfolio for a freelance photographer',
    href: 'https://bymarro.vercel.app/',
    image: '/projects/marro.png',
    lift: true,
  },
  {
    name: 'SiteBoost',
    note: 'Landing page for website audits',
    href: 'https://site-boost.vercel.app/',
    image: '/projects/siteboost.png',
  },
  {
    name: 'LuxuryPerspective',
    note: 'A premium real estate UI study',
    href: 'https://luxury-perspective.vercel.app/',
    image: '/projects/luxury-perspective.png',
    lift: true,
  },
  {
    name: 'DreamFinders',
    note: 'Search-driven property browsing',
    href: 'https://dream-finders.vercel.app/',
    image: '/projects/dreamfinders.png',
  },
];

interface Role {
  period: string;
  role: string;
  org: string;
  /** Set when the organisation has a page here. */
  href?: string;
  note: string;
}

const experience: Role[] = [
  {
    period: 'Feb to May 2026',
    role: 'Junior QA Engineer',
    org: 'Porsche eBike Performance',
    note: 'Sole active QA on the mobile app, owning test planning, execution and reporting across iOS and Android. Wrote Appium automation for regression flows so repeatable checks stopped depending on someone walking through the app by hand, and tested gRPC and HTTP endpoints against the application contract rather than only through the interface. International team, English as the working language. The role ended when the site closed.',
  },
  {
    period: '2021 to now',
    role: 'Full-stack developer, freelance',
    org: 'Self-employed',
    note: 'Client work end to end: scoping, build, testing, deployment and maintenance in production. Branch workflow with pull requests, and GitHub Actions so projects deploy on merge rather than by hand.',
  },
  {
    period: 'Dec 2025 to now',
    role: 'Co-founder and developer',
    org: 'Vectra XR',
    href: '/work/vectraxr',
    note: 'Led the frontend architecture, wrote the Python service that converts 3D files, and ran code review and the release process for two other engineers.',
  },
];

export default function Home() {
  const hasResume = publicFileExists('resume.pdf');
  // First of these that exists gets used, so the photo can move without a
  // code change.
  const portrait = ['images/antonio-brkic.jpg', 'avatar.jpg', 'avatar.png'].find(
    publicFileExists,
  );
  const shots = Object.fromEntries(
    work.map((p) => [p.slug, publicFileExists(p.image)]),
  );

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
            <Link
              href="/contact"
              className="art-mono"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.95em 1.5em',
              }}
            >
              Get in touch
            </Link>
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
                  {shots[p.slug] ? (
                    <Shot src={p.image} alt={`${p.name} interface`} url={p.url} lift={p.lift} />
                  ) : (
                    /* No capture yet. A typographic panel keeps the two-column
                       rhythm instead of leaving a hole. */
                    <div
                      className="flex items-end"
                      style={{
                        border: '1px solid var(--rule)',
                        borderRadius: 10,
                        aspectRatio: '16 / 10',
                        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                      }}
                    >
                      <span
                        className="art-display"
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--ink-3)' }}
                      >
                        {p.url}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* ── Experience ───────────────────────────────────────────────
          Employment goes above About. It is the part a recruiter is
          scanning for and the part a portfolio usually leaves out.    */}
      <section className="art-pad py-[12vh]" style={{ borderTop: '1px solid var(--rule)' }}>
        <h2
          className="art-display mb-10"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', color: 'var(--ink)' }}
        >
          Experience
        </h2>

        {experience.map((e, i) => (
          <div
            key={e.role}
            className="grid lg:grid-cols-[11rem_minmax(0,1fr)] gap-x-10 gap-y-2 py-8"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--rule)' }}
          >
            <div className="art-mono lg:pt-2" style={{ color: 'var(--ink-3)' }}>
              {e.period}
            </div>
            <div>
              <h3
                className="art-display"
                style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', color: 'var(--ink)' }}
              >
                {e.role}
              </h3>
              <div className="art-mono mt-2 mb-4" style={{ color: 'var(--ink-2)' }}>
                {e.href ? (
                  <Link href={e.href} className="art-link">
                    {e.org}
                  </Link>
                ) : (
                  e.org
                )}
              </div>
              <p
                className="art-serif"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-2)',
                  maxWidth: '58ch',
                }}
              >
                {e.note}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── About ────────────────────────────────────────────────────
          Sits after the work on purpose. Anyone scanning gets the projects
          first; this is here for the people who kept reading.            */}
      <section
        className="art-pad py-[12vh] grid lg:grid-cols-[1fr_1.4fr] gap-x-16 gap-y-10"
        style={{ borderTop: '1px solid var(--rule)' }}
      >
        <div>
          {portrait && (
            <div className="art-portrait mb-10">
              <Image
                src={`/${portrait}`}
                alt="Antonio Brkić"
                fill
                sizes="(max-width: 1024px) 60vw, 17rem"
              />
            </div>
          )}
          <h2
            className="art-display mb-8"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)', color: 'var(--ink)' }}
          >
            About
          </h2>
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6">
            {[
              ['Based in', 'Zagreb, Croatia'],
              ['Studying', 'Computer engineering at TVZ, graduating June 2027'],
              ['Working with', 'TypeScript, Next.js, Node, PostgreSQL, Python'],
              ['Availability', 'Open to full-time roles, can start immediately'],
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
          <p style={{ marginTop: '1.2em' }}>
            Four months as the only QA engineer on a mobile app changed how I
            write my own code. Testing, reproducing a defect properly and
            reading someone else&rsquo;s work carefully are habits now rather
            than things I mean to get around to. What I want next is a team
            where someone more experienced reviews what I write.
          </p>
        </div>
      </section>


      {/* ── More work ────────────────────────────────────────────────
          The track carries the set twice. The second copy is decorative:
          hidden from assistive tech and out of the tab order, so nobody
          hears or tabs through nine duplicate links.                    */}
      <section data-no-reveal style={{ borderTop: '1px solid var(--rule)' }}>
        <div className="art-pad pt-[8vh] pb-8">
          <h2
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--ink)' }}
          >
            More work
          </h2>
        </div>

        <div className="art-marquee pb-[8vh]">
          <div className="art-marquee-track">
            {[0, 1].map((copy) =>
              more.map((item) => {
                const duplicate = copy === 1;
                const card = (
                  <div className="art-mini">
                    {item.image ? (
                      <div className={`art-mini-media ${item.lift ? 'art-lift' : ''}`}>
                        <Image src={item.image} alt={`${item.name} interface`} fill sizes="17rem" />
                      </div>
                    ) : (
                      <div className="art-mini-media art-mini-blank">
                        <span
                          className="art-display"
                          style={{ fontSize: '1.4rem', color: 'var(--ink-3)' }}
                        >
                          {item.name}
                        </span>
                      </div>
                    )}
                    <h3
                      className="art-display mt-4 mb-1"
                      style={{ fontSize: '1.35rem', color: 'var(--ink)' }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className="art-serif"
                      style={{ fontSize: '0.95rem', lineHeight: 1.45, color: 'var(--ink-2)' }}
                    >
                      {item.note}
                    </p>
                  </div>
                );

                const key = `${item.name}-${copy}`;
                const hide = duplicate
                  ? { 'aria-hidden': true as const, tabIndex: -1 }
                  : {};

                return item.internal ? (
                  <Link key={key} href={item.href} className="block" {...hide}>
                    {card}
                  </Link>
                ) : (
                  <a
                    key={key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    {...hide}
                  >
                    {card}
                  </a>
                );
              }),
            )}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <footer
        className="art-pad py-[10vh]"
        style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}
      >
        <Link
          href="/contact"
          className="art-display block mb-[6vh]"
          style={{ fontSize: 'clamp(2rem, 8vw, 7rem)' }}
        >
          Say hello
        </Link>
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
