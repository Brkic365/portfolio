import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';

export const metadata: Metadata = {
  title: 'Runtime',
  description:
    'An API monitoring dashboard built in 24 hours at a hackathon, showing latency, throughput and errors from live request traffic.',
  alternates: { canonical: '/work/runtime' },
};

const theme = projectThemes.runtime;

/** Deterministic sparkline path. Decorative — not a reading of real traffic. */
function spark(seedInit: number, points = 42, w = 240, h = 56) {
  let seed = seedInit;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  let v = 0.5;
  const pts: string[] = [];
  for (let i = 0; i < points; i++) {
    v = Math.max(0.08, Math.min(0.92, v + (rnd() - 0.5) * 0.28));
    pts.push(`${((i / (points - 1)) * w).toFixed(1)},${(h - v * h).toFixed(1)}`);
  }
  return pts.join(' ');
}

const panels = [
  ['Latency', 'p50 · p95 · p99', 991],
  ['Throughput', 'requests per minute', 5501],
  ['Errors', '4xx and 5xx by route', 7717],
];

export default function RuntimePage() {
  return (
    <div className="art" data-theme="runtime" style={themeVars(theme)}>
      <main>
        {/* ── Hero: quiet, with instrumentation immediately under it ── */}
        <section className="art-pad pt-[18vh] pb-[8vh]">
          <div className="art-mono mb-6" style={{ color: 'var(--accent)' }}>
            Hackathon, 24 hours
          </div>
          <div className="flex flex-wrap items-end justify-between gap-10">
            <h1
              className="art-display art-enter art-enter-2"
              style={{ fontSize: 'clamp(3rem, 12vw, 12rem)', color: 'var(--ink)' }}
            >
              Runtime
            </h1>
            <p
              className="art-serif"
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)',
                lineHeight: 1.4,
                color: 'var(--ink-2)',
                maxWidth: '26ch',
              }}
            >
              An API monitoring dashboard, start to finish, in a day.
            </p>
          </div>
        </section>

        {/* ── Instrument strip ─────────────────────────────────────── */}
        <section
          className="grid sm:grid-cols-3"
          style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}
        >
          {panels.map(([label, sub, seed], i) => (
            <div
              key={label as string}
              className="p-6 sm:p-8"
              style={{ borderLeft: i === 0 ? 'none' : '1px solid var(--rule)' }}
            >
              <div className="art-mono mb-1" style={{ color: 'var(--ink)' }}>
                {label}
              </div>
              <div className="art-mono mb-5" style={{ color: 'var(--ink-3)' }}>
                {sub}
              </div>
              <svg
                viewBox="0 0 240 56"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{ width: '100%', height: '56px', display: 'block' }}
              >
                <polyline
                  points={spark(seed as number)}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          ))}
        </section>

        <section className="art-pad py-[9vh]">
          <Shot
            src="/projects/runtime.png"
            alt="The Runtime analytics dashboard"
            url="runtime-rust.vercel.app"
            lift={true}
            ratio="16 / 10"
            sizes="(max-width: 1024px) 92vw, 78vw"
          />
        </section>

        <section className="art-pad py-[10vh] grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-20">
          <div
            className="art-serif"
            style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
          >
            <p>
              The brief was an API monitoring dashboard and the clock was 24
              hours, so most of the decisions were about what to leave out.
              Latency, throughput and errors made the cut. Everything else got
              dropped, which in hindsight is roughly the right list anyway.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              Building against a deadline that short changes how you work. There
              was no time to make anything configurable, so every choice about
              thresholds and time windows got hard-coded to whatever looked
              reasonable at 3am. That is the first thing I would undo.
            </p>
          </div>
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6 self-start">
            {[
              ['Built with', 'Next.js, TypeScript'],
              ['Auth', 'NextAuth.js'],
              ['Data layer', 'SWR, Recharts'],
              ['Built in', '24 hours'],
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
            href="/work/vectraxr"
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: 'var(--ink)' }}
          >
            Vectra XR
          </Link>
        </nav>
      </main>
    </div>
  );
}
