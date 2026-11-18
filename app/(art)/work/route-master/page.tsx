import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata({
  title: 'RouteMaster',
  description:
    'A traffic simulation and routing tool written in Python with no external libraries, running A* over OpenStreetMap road data.',
  path: '/work/route-master',
  card: 'route-master',
  type: 'article',
});

const p = getProject('route-master');

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
    <CaseStudy
      project={p}
      hero={{
        title: (
          <>
            Route
            <br className="mbr" />
            Master
          </>
        ),
        k: 0.1209,
        km: 0.223,
        lead: 'Vehicles finding their way across a real road network, with nothing but the standard library behind it.',
        role: 'College project, Python',
      }}
    >
      {/* The diagram runs the same search the project does, at build time. */}
      <section className="diagram" aria-label="Route diagram">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="A road network graph with one route solved across it"
          style={{ height: 'clamp(240px, 52vh, 460px)' }}
        >
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="rgba(237,236,230,.16)"
              strokeWidth="1"
            />
          ))}
          {visited.map((n, i) => (
            <circle key={i} cx={nodes[n].x} cy={nodes[n].y} r="2" fill="var(--ash)" opacity="0.6" />
          ))}
          <polyline
            points={path.map((n) => `${nodes[n].x},${nodes[n].y}`).join(' ')}
            fill="none"
            stroke="var(--acc)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {[path[0], path[path.length - 1]].map((n, i) => (
            <circle key={i} cx={nodes[n].x} cy={nodes[n].y} r="6" fill="var(--acc)" />
          ))}
        </svg>
        <div className="legend-row wrap small">
          <span>{nodes.length} nodes</span>
          <span>{edges.length} edges</span>
          <span>{visited.length} expanded</span>
          <b>{path.length - 1} hops</b>
        </div>
      </section>

      {/* Technical notes, set like a drawing schedule. */}
      <section className="sec wrap" aria-label="Technical notes">
        <Facts
          items={[
            ['Search', 'A* with a straight-line heuristic'],
            ['Neighbours', 'Spatial hash written from scratch'],
            ['Data', 'OpenStreetMap road geometry'],
            ['Dependencies', 'None. Standard library only'],
          ]}
        />
      </section>

      <Frame
        src={p.image}
        alt="The RouteMaster simulation dashboard"
        url={p.url}
        href={`https://${p.url}`}
        lift
        ratio="16 / 10"
      />

      <Band accent={p.accent} sig={p.sig} />

      <section className="sec wrap" aria-labelledby="rule-h">
        <SectionHead id="rule-h" title="No libraries" accent={p.accent} note="A rule I set myself." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              Built for college, in Python, with a rule I set myself: no external libraries.
            </p>
            <p>
              Everything runs on the standard library, including the pathfinding, the spatial indexing
              and the drawing. That is also why it looks the way it does. Tkinter is not going to win any
              design awards, and I decided early that I would rather have the algorithms be the
              interesting part than spend the time making it pretty.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="hash-h">
        <SectionHead id="hash-h" title="From a scan to a lookup" size="mid" />
        <div className="prose">
          <p className="label small">The spatial hash</p>
          <div className="txt">
            <p>
              Pathfinding across a city is cheap the first time. It gets expensive when hundreds of
              vehicles each need a fresh route every time something changes, and the plain neighbour
              search starts eating the whole frame.
            </p>
            <p className="big">
              Bucketing the network into a spatial hash turned that scan into a lookup, which is what
              made it possible to run the simulation and watch it at the same time.
            </p>
          </div>
        </div>
      </section>
    </CaseStudy>
  );
}
