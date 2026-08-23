import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';

export const metadata: Metadata = {
  title: 'RouteMaster',
  description:
    'A traffic simulation and routing tool written in Python with no external libraries, running A* over OpenStreetMap road data.',
  alternates: { canonical: '/work/route-master' },
};

const theme = projectThemes['route-master'];

const W = 1400;
const H = 420;

/**
 * Deterministic road graph with one solved route highlighted.
 * Decorative, but it runs the same search the project does.
 */
function network() {
  let seed = 20260812;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const cols = 22;
  const rows = 8;
  const m = 30;
  const dx = (W - 2 * m) / (cols - 1);
  const dy = (H - 2 * m) / (rows - 1);

  const nodes: { x: number; y: number; e: number[] }[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (rnd() < 0.14 && c > 0 && c < cols - 1) continue;
      nodes.push({
        x: m + c * dx + (rnd() - 0.5) * dx * 0.55,
        y: m + r * dy + (rnd() - 0.5) * dy * 0.55,
        e: [],
      });
    }
  }

  const edges: [number, number][] = [];
  const lim = Math.max(dx, dy) * 1.3;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < lim) {
        edges.push([i, j]);
        nodes[i].e.push(j);
        nodes[j].e.push(i);
      }
    }
  }

  const nearest = (x: number, y: number) =>
    nodes.reduce(
      (best, n, i) =>
        Math.hypot(n.x - x, n.y - y) < Math.hypot(nodes[best].x - x, nodes[best].y - y) ? i : best,
      0,
    );

  const start = nearest(m, H * 0.75);
  const goal = nearest(W - m, H * 0.25);

  // A* with a straight-line heuristic, the same shape as the project's search.
  const h = (a: number, b: number) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
  const open = [start];
  const came: Record<number, number> = {};
  const g: Record<number, number> = { [start]: 0 };
  const f: Record<number, number> = { [start]: h(start, goal) };
  const visited: number[] = [];

  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (f[open[i]] < f[open[bi]]) bi = i;
    const cur = open.splice(bi, 1)[0];
    visited.push(cur);
    if (cur === goal) break;
    for (const nb of nodes[cur].e) {
      const t = g[cur] + h(cur, nb);
      if (g[nb] === undefined || t < g[nb]) {
        came[nb] = cur;
        g[nb] = t;
        f[nb] = t + h(nb, goal);
        if (!open.includes(nb)) open.push(nb);
      }
    }
  }

  const path: number[] = [goal];
  while (came[path[0]] !== undefined) path.unshift(came[path[0]]);

  return { nodes, edges, path, visited, start, goal };
}

export default function RouteMasterPage() {
  const { nodes, edges, path, visited } = network();

  return (
    <div className="art" data-theme="route-master" style={themeVars(theme)}>
      <main>
        {/* ── Hero: the diagram is the hero ────────────────────────── */}
        <section className="art-pad pt-[16vh] pb-[6vh]">
          <div className="art-mono mb-6" style={{ color: 'var(--accent)' }}>
            College project, Python
          </div>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h1
              className="art-display art-enter art-enter-2"
              style={{ fontSize: 'clamp(2.8rem, 10vw, 10rem)', color: 'var(--ink)' }}
            >
              Route
              <br />
              Master
            </h1>
            <p
              className="art-serif"
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.45rem)',
                lineHeight: 1.4,
                color: 'var(--ink-2)',
                maxWidth: '28ch',
              }}
            >
              Vehicles finding their way across a real road network, with
              nothing but the standard library behind it.
            </p>
          </div>
        </section>

        <section className="w-full" style={{ borderTop: '1px solid var(--rule)' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label="A road network graph with one route solved across it"
            style={{ width: '100%', height: 'clamp(240px, 52vh, 460px)', display: 'block' }}
          >
            {edges.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                stroke="var(--rule)"
                strokeWidth="1"
              />
            ))}
            {visited.map((n, i) => (
              <circle key={i} cx={nodes[n].x} cy={nodes[n].y} r="2" fill="var(--ink-3)" opacity="0.5" />
            ))}
            <polyline
              points={path.map((n) => `${nodes[n].x},${nodes[n].y}`).join(' ')}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {[path[0], path[path.length - 1]].map((n, i) => (
              <circle key={i} cx={nodes[n].x} cy={nodes[n].y} r="6" fill="var(--accent)" />
            ))}
          </svg>
          <div
            className="art-pad art-mono py-3 flex flex-wrap gap-x-8 gap-y-1"
            style={{ borderTop: '1px solid var(--rule)', color: 'var(--ink-3)' }}
          >
            <span>{nodes.length} nodes</span>
            <span>{edges.length} edges</span>
            <span>{visited.length} expanded</span>
            <span style={{ color: 'var(--accent)' }}>{path.length - 1} hops</span>
          </div>
        </section>

        {/* ── Technical notes, set like a drawing schedule ─────────── */}
        <section className="art-pad py-[10vh]">
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {[
              ['Search', 'A* with a straight-line heuristic'],
              ['Neighbours', 'Spatial hash written from scratch'],
              ['Data', 'OpenStreetMap road geometry'],
              ['Dependencies', 'None. Standard library only'],
            ].map(([k, v]) => (
              <div key={k} style={{ borderTop: '1px solid var(--rule)', paddingTop: '1rem' }}>
                <dt className="art-mono mb-2" style={{ color: 'var(--accent)' }}>
                  {k}
                </dt>
                <dd className="art-serif" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="art-pad py-[9vh]">
          <Shot
            src="/projects/route-master.png"
            alt="The RouteMaster simulation dashboard"
            url="github.com/Brkic365/routeMaster"
            lift={true}
            ratio="16 / 10"
            sizes="(max-width: 1024px) 92vw, 78vw"
          />
        </section>

        <section className="art-pad py-[10vh]">
          <div
            className="art-serif"
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.65,
              color: 'var(--ink-2)',
              maxWidth: '40rem',
            }}
          >
            <p>
              Built for college, in Python, with a rule I set myself: no
              external libraries. Everything runs on the standard library,
              including the pathfinding, the spatial indexing and the drawing.
              That is also why it looks the way it does. Tkinter is not going to
              win any design awards, and I decided early that I would rather
              have the algorithms be the interesting part than spend the time
              making it pretty.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              Pathfinding across a city is cheap the first time. It gets
              expensive when hundreds of vehicles each need a fresh route every
              time something changes, and the plain neighbour search starts
              eating the whole frame. Bucketing the network into a spatial hash
              turned that scan into a lookup, which is what made it possible to
              run the simulation and watch it at the same time.
            </p>
          </div>
        </section>

        <nav
          className="art-pad py-[8vh] flex flex-wrap items-baseline justify-between gap-6"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <Link href="/" className="art-mono" style={{ color: 'var(--ink-3)' }}>
            Back to index
          </Link>
          <Link
            href="/work/runtime"
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: 'var(--ink)' }}
          >
            Runtime
          </Link>
        </nav>
      </main>
    </div>
  );
}
