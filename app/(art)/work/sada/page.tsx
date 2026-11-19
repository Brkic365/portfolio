import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import Steps from '@/components/site/Steps';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata({
  title: 'Sada',
  description:
    'Sada names the nearest café or bench in central Zagreb that is in the sun or the shade right now, worked out in the browser from the city’s 3D building model and the position of the sun.',
  path: '/work/sada',
  card: 'sada',
  type: 'article',
});

const p = getProject('sada');

const steps: [string, string][] = [
  ['Tap Sun or Shade', 'Café or bench, then the light you want. That is the whole interface.'],
  [
    'It picks one place',
    'The nearest that has that light now and keeps it for at least 20 minutes, with the time it ends: “Sun until 13:32”.',
  ],
  [
    'It draws the walk',
    'The route there, over the city in 3D, lit from where the sun stands, so the shadows on the map fall where the answer says.',
  ],
];

export default function SadaPage() {
  return (
    <CaseStudy
      project={p}
      hero={{
        title: 'Sada',
        k: 0.3112,
        km: 0.3112,
        lead: 'Sada means “now”. Where to sit in the sun, or out of it, in the centre of Zagreb.',
        role: 'Zagreb Hackathon, March 2026, with Marko Livaic',
      }}
    >
      <section className="sec wrap" style={{ paddingTop: 'clamp(40px, 6vw, 88px)' }} aria-labelledby="how-h">
        <SectionHead id="how-h" title="How it works" accent={p.accent} note="One question, one answer, and until when." />
        <Steps items={steps} />
      </section>

      <Frame
        src={p.image}
        alt="Sada over a 3D map of Zagreb: Hi Chai, sun until 13:34, a three minute walk"
        url={p.url}
        href={`https://${p.url}/`}
        ratio="22 / 15"
      />

      <Band />

      <section className="sec wrap" aria-labelledby="sun-h">
        <SectionHead id="sun-h" title="From the buildings" accent={p.accent} note="No weather service, no guesswork about shade." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              Sun and shade come from the city’s own 3D model of 8,732 buildings and the position of the sun.
            </p>
            <p>
              Each building is a flat-roofed block. For a seat, the app follows a line from it toward the sun and
              looks for the first block the line enters. If that roof is higher than the line, the seat is in
              shade. “Until when” is the same question asked again for every minute ahead.
            </p>
            <p>
              The map draws those same blocks with one light where the sun is, so what you see on screen is cast by
              the buildings the answer came from. All of it runs in a web worker in the browser. There is no server.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="seat-h">
        <SectionHead id="seat-h" title="Where the tables are" size="mid" />
        <div className="prose">
          <p className="label small">An assumption, said out loud</p>
          <div className="txt">
            <p>
              OpenStreetMap puts most cafés as a point inside their building, where it is always shade. So for a
              café mapped under a roof, the app judges a point two metres outside its nearest wall that faces open
              ground, skipping walls shared with the next building.
            </p>
            <p className="big">
              Where the tables really stand is not mapped anywhere, and the app says so under every pick that
              relies on the guess.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Built with', 'Next.js, Mapbox GL, Web Workers'],
            ['Covers', '2.3 by 1.3 km around the main square'],
            ['Knows', '8,732 buildings, 147 cafés, 342 benches'],
            ['Live at', p.url, `https://${p.url}/`],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
