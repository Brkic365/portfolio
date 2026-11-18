import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata({
  title: 'Runtime',
  description:
    'An API monitoring platform built end to end in 24 hours at the Treblle hackathon: an Express proxy that logs and scores traffic, and a Next.js dashboard over it.',
  path: '/work/runtime',
  card: 'runtime',
  type: 'article',
});

const p = getProject('runtime');

/** Deterministic sparkline path. Decorative, not a reading of real traffic. */
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

const panels: [string, string, number][] = [
  ['Latency', 'p50 · p95 · p99', 991],
  ['Throughput', 'requests per minute', 5501],
  ['Errors', '4xx and 5xx by route', 7717],
];

export default function RuntimePage() {
  return (
    <CaseStudy
      project={p}
      hero={{
        title: 'Runtime',
        k: 0.1898,
        km: 0.1898,
        lead: 'An API monitoring platform, both halves, in a day.',
        role: 'Treblle hackathon, 24 hours',
      }}
    >
      {/* Instrument strip. Decorative sparklines, not real traffic. */}
      <section className="diagram instruments small" aria-hidden="true">
        {panels.map(([label, sub, seed]) => (
          <div key={label}>
            <b>{label}</b>
            <span>{sub}</span>
            <svg viewBox="0 0 240 56" preserveAspectRatio="none" style={{ height: 56 }}>
              <polyline
                points={spark(seed)}
                fill="none"
                stroke="var(--acc)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        ))}
      </section>

      <Frame
        src={p.image}
        alt="The Runtime analytics dashboard"
        url={p.url}
        href={`https://${p.url}`}
        lift
        ratio="16 / 10"
      />

      <Band />

      <section className="sec wrap" aria-labelledby="brief-h">
        <SectionHead id="brief-h" title="Both ends" accent={p.accent} note="Treblle set the brief: build something useful for API monitoring." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">Treblle set the brief: build something useful for API monitoring. I built both ends.</p>
            <p>
              Requests pass through an Express proxy that logs them, scores each one for security
              problems, resolves the caller to a rough location, and rolls the results up into
              pre-computed metrics so the dashboard is reading summaries rather than recomputing on
              every load. The Next.js front end sits on top of that.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="day-h">
        <SectionHead id="day-h" title="What a deadline that short changes" size="mid" />
        <div className="prose">
          <p className="label small">In hindsight</p>
          <div className="txt">
            <p>
              A deadline that short changes how you work. Aggregating metrics up front was the decision
              that paid off, since it meant the dashboard stayed fast without any caching work. The one
              I regret is hard-coding every threshold and time window to whatever looked reasonable at
              3am, because nothing is configurable without a redeploy.
            </p>
            <p className="big">
              SQLite was the right call for a hackathon and the first thing I would replace.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          cols={3}
          items={[
            ['Front end', 'Next.js, TypeScript, SWR, Recharts'],
            ['Back end', 'Node, Express, TypeScript'],
            ['Data', 'Prisma, SQLite'],
            ['Auth', 'JWT and OAuth'],
            ['Built in', '24 hours'],
            ['Source', 'Frontend and backend on GitHub'],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
