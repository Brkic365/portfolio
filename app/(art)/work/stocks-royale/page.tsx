import Link from 'next/link';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata({
  title: 'Stocks Royale',
  description:
    'A college project: a trading game played against simulated market data, streamed over WebSockets from a Node and PostgreSQL backend.',
  path: '/work/stocks-royale',
  card: 'stocks-royale',
  type: 'article',
});

const p = getProject('stocks-royale');

/**
 * Decorative candlestick series. Deterministic so the server output is stable.
 * This is a graphic element, not a rendering of real market data.
 */
function candles(count = 46) {
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  let price = 50;
  return Array.from({ length: count }, (_, i) => {
    const open = price;
    price += (rnd() - 0.46) * 9;
    price = Math.max(12, Math.min(88, price));
    const close = price;
    const high = Math.max(open, close) + rnd() * 5;
    const low = Math.min(open, close) - rnd() * 5;
    return { i, open, close, high, low, up: close >= open };
  });
}

export default function StocksRoyalePage() {
  const data = candles();
  const W = 1200;
  const H = 300;
  const step = W / data.length;

  return (
    <CaseStudy
      project={p}
      hero={{
        title: (
          <>
            Stocks
            <br className="mbr" /> Royale
          </>
        ),
        k: 0.111,
        km: 0.2264,
        lead: 'A trading demo where the market is simulated, not real.',
        role: 'College project',
      }}
      end={
        <nav className="backrow wrap small" aria-label="More">
          <Link href="/#work">&larr; Back to selected work</Link>
          <a className="ul" href={`https://${p.url}/`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--paper)' }}>
            Open it <span aria-hidden="true">↗</span>
          </a>
        </nav>
      }
    >
      <Frame
        src={p.image}
        alt="Stocks Royale trading interface"
        url={p.url}
        href={`https://${p.url}/`}
        lift
        priority
        ratio="16 / 10"
        tight
      />

      <section className="diagram" aria-label="Candlestick chart">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Decorative candlestick chart"
          style={{ height: 'clamp(160px, 26vh, 300px)' }}
        >
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(237,236,230,.14)" strokeWidth="1" />
          ))}
          {data.map((c) => {
            const x = c.i * step + step / 2;
            const y = (v: number) => H - (v / 100) * H;
            const col = c.up ? 'var(--acc)' : 'var(--ash)';
            return (
              <g key={c.i}>
                <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} stroke={col} strokeWidth="1.5" />
                <rect
                  x={x - step * 0.28}
                  y={y(Math.max(c.open, c.close))}
                  width={step * 0.56}
                  height={Math.max(2, Math.abs(y(c.open) - y(c.close)))}
                  fill={col}
                />
              </g>
            );
          })}
        </svg>
      </section>

      <section className="sec wrap" aria-labelledby="sim-h">
        <SectionHead id="sim-h" title="Simulated" accent={p.accent} note="There is no real market behind it." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              Built for college. There is no real market behind it.
            </p>
            <p>
              A Node backend generates the price movement, stores it in Postgres and pushes updates to
              the browser over a socket, and the frontend charts whatever arrives. The trading, the
              leaderboard and the charts are all real code, the prices are not.
            </p>
            <p>
              Prices move faster than a chart wants to redraw, so most of the work went into deciding
              how often to repaint without the numbers going stale on screen.
            </p>
            <p className="note small">
              <b>Heads up:</b> the backend is not always running, so the live demo may load with no
              data.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Frontend', 'Next.js, Lightweight Charts'],
            ['Backend', 'Node, Express, PostgreSQL'],
            ['Transport', 'Socket.io'],
            ['Source', 'github.com/Brkic365/Stocks-Royale', 'https://github.com/Brkic365/Stocks-Royale'],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
