import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import Steps from '@/components/site/Steps';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata({
  title: 'Bura',
  description:
    'Bura draws the current wind over the Croatian Adriatic as tens of thousands of particles on the GPU, from DHMZ station reports and an Open-Meteo forecast, and names the wind that is blowing.',
  path: '/work/bura',
  card: 'bura',
  type: 'article',
});

const p = getProject('bura');

const steps: [string, string][] = [
  [
    'Every 15 minutes',
    'It reads the hourly DHMZ station reports and, every few hours, an Open-Meteo forecast for 542 points along the coast.',
  ],
  [
    'Model, corrected by stations',
    'The forecast is smooth but coarse. Where a station reports, its error is worked out and blended back in, fading to the model with distance.',
  ],
  [
    'Drawn on the GPU',
    'Particles follow the result. Colour is speed, trails are direction, and the label says which wind it is: bura, jugo, maestral.',
  ],
];

export default function BuraPage() {
  return (
    <CaseStudy
      project={p}
      hero={{
        title: 'Bura',
        k: 0.3394,
        km: 0.3394,
        lead: 'The wind over the Croatian coast right now, and for the next two days, as moving light.',
        role: 'Personal project, November 2026. Data from DHMZ and Open-Meteo.',
      }}
    >
      <section className="sec wrap" style={{ paddingTop: 'clamp(40px, 6vw, 88px)' }} aria-labelledby="how-h">
        <SectionHead id="how-h" title="How it works" accent={p.accent} note="From two public feeds to one moving map." />
        <Steps items={steps} />
      </section>

      <Frame
        src={p.image}
        alt="Bura blowing down the Croatian coast: pale blue particle trails fan out south-west from Senj, Split and Makarska"
        url={p.url}
        href={`https://${p.url}/`}
        ratio="2000 / 1250"
        lift={p.lift}
      />

      <Band />

      <section className="sec wrap" aria-labelledby="fix-h">
        <SectionHead id="fix-h" title="Where the model is wrong" accent={p.accent} note="Bura is narrower than the forecast grid." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              A bura comes down through mountain gaps in jets 10 to 20 km wide. The forecast sees the coast in 25 km
              squares, so it smears them out.
            </p>
            <p>
              The stations know better, but only at a few points. So the model stays as the base and the stations
              correct it. At each station the difference between what it measured and what the model said is taken
              as a wind vector, never as speed and direction separately, so two opposing winds can’t average into a
              breeze from the wrong side.
            </p>
            <p>
              Those corrections spread out with inverse-distance weights that reach zero at 45 km, plus a constant
              background weight. Next to a station the map matches the reading exactly. Out at sea it fades back to
              the model, instead of carrying the nearest station’s error across the whole Adriatic.
            </p>
            <p>
              Mountain-top stations like Zavižan are left out, since the wind up there says little about the sea.
              The last correction keeps nudging the forecast for a few hours, then lets go.
            </p>
          </div>
        </div>
      </section>

      <Frame
        src="/projects/bura-kvarner.jpg"
        alt="Zoomed into Kvarner, with station markers and a readout near Jablanac: 7.9 m/s from the north-east, gusts 14 m/s"
        url={p.url}
        href={`https://${p.url}/`}
        ratio="2000 / 1250"
        lift
        caption={['Kvarner', 'Hovering anywhere gives the wind there, and the nearest station’s reading.']}
      />

      <section className="sec wrap" aria-labelledby="gpu-h">
        <SectionHead id="gpu-h" title="Particles on the GPU" size="mid" />
        <div className="prose">
          <p className="label small">32,000 on a laptop, 8,000 on a phone</p>
          <div className="txt">
            <p>
              Particle positions live in a texture and are moved by a fragment shader, which samples two hourly wind
              frames and blends between them. Scrubbing the timeline or letting it play stays smooth because the
              wind is interpolated in time as well as space. Each particle draws one short line per frame, with no
              vertex buffers, over trails that fade a little every frame.
            </p>
            <p className="big">The CPU only sets a few numbers per frame. The client ships with no dependencies, about 25 kB gzipped.</p>
            <p>
              If frames start taking too long the particle count drops a step, and software-rendered WebGL, the kind
              Lighthouse runs, gets a lighter version.
            </p>
          </div>
        </div>
      </section>

      <Frame
        src="/projects/bura-jugo.jpg"
        alt="Jugo: a steady south-easterly wind along the coast"
        url={p.url}
        href={`https://${p.url}/`}
        ratio="2000 / 1250"
        lift
        tight
        caption={['Jugo', 'The warm south-easterly, steadier and wider than bura.']}
      />

      <section className="sec flush wrap" aria-labelledby="free-h">
        <SectionHead id="free-h" title="Running it for free" size="mid" />
        <div className="prose">
          <p className="label small">Inside the free tiers</p>
          <div className="txt">
            <p>
              DHMZ publishes only the current hour, so Bura keeps its own history by polling. GitHub Actions is the
              15-minute clock, since free Vercel cron runs once a day. Everything goes into a single stored file,
              written only when something changed, about 30 writes a day. Each hour of wind leaves the server as a
              30 kB binary frame, cached at the edge.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Built with', 'TypeScript, WebGL2, Vercel functions and Blob'],
            ['Data', 'DHMZ stations, Open-Meteo forecast, Natural Earth coastline'],
            ['Covers', '24 hours back, 48 ahead'],
            ['Source', 'github.com/Brkic365/bura', 'https://github.com/Brkic365/bura'],
            ['Live at', p.url, `https://${p.url}/`],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
