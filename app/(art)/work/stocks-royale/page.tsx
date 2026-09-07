import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';

export const metadata: Metadata = {
  title: 'Stocks Royale',
  description:
    'A college project: a trading game played against simulated market data, streamed over WebSockets from a Node and PostgreSQL backend.',
  alternates: { canonical: '/work/stocks-royale' },
};

const theme = projectThemes['stocks-royale'];

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
    <div className="art" data-theme="stocks-royale" style={themeVars(theme)}>
      <main>
        <section className="grid lg:grid-cols-[1.1fr_1fr] items-center min-h-[80vh] gap-10 lg:gap-0">
          <div className="art-pad pt-[16vh] lg:pt-0 relative z-10">
            <div className="art-mono mb-6" style={{ color: 'var(--accent)' }}>
              College project
            </div>
            <h1
              className="art-display art-enter art-enter-2"
              style={{ fontSize: 'clamp(2.8rem, 9vw, 9rem)', color: 'var(--ink)' }}
            >
              Stocks
              <br />
              Royale
            </h1>
            <p
              className="art-serif mt-8"
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)',
                color: 'var(--ink-2)',
                maxWidth: '28ch',
              }}
            >
              A trading demo where the market is simulated, not real.
            </p>
          </div>

          {/* Shot keeps its own column and bleeds off the right edge.
              Overlapping the headline would put type on top of type. */}
          <div className="pl-5 sm:pl-8 lg:pl-0 pr-5 sm:pr-8 lg:pr-0 lg:-mr-[6%]">
            <Shot
              src="/projects/stocks-royale.png"
              alt="Stocks Royale trading interface"
              url="stocks-royale.vercel.app"
              lift
              priority
              ratio="4 / 3"
              sizes="(max-width: 1024px) 92vw, 52vw"
            />
          </div>
        </section>

        <section
          className="w-full py-[6vh]"
          style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label="Decorative candlestick chart"
            style={{ width: '100%', height: 'clamp(160px, 26vh, 300px)', display: 'block' }}
          >
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--rule)" strokeWidth="1" />
            ))}
            {data.map((c) => {
              const x = c.i * step + step / 2;
              const y = (v: number) => H - (v / 100) * H;
              const col = c.up ? 'var(--accent)' : 'var(--ink-3)';
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

        <section className="art-pad py-[10vh] grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20">
          <div
            className="art-serif"
            style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
          >
            <p>
              Built for college. There is no real market behind it. A Node
              backend generates the price movement, stores it in Postgres and
              pushes updates to the browser over a socket, and the frontend
              charts whatever arrives. The trading, the leaderboard and the
              charts are all real code, the prices are not.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              Prices move faster than a chart wants to redraw, so most of the
              work went into deciding how often to repaint without the numbers
              going stale on screen.
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
              Heads up: the backend is not always running, so the live demo may
              load with no data.
            </p>
          </div>
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6 self-start">
            {[
              ['Frontend', 'Next.js, Lightweight Charts'],
              ['Backend', 'Node, Express, PostgreSQL'],
              ['Transport', 'Socket.io'],
              ['Source', 'github.com/Brkic365/Stocks-Royale', 'https://github.com/Brkic365/Stocks-Royale'],
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
