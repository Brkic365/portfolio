import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import Steps from '@/components/site/Steps';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata = pageMetadata({
  title: 'Tavola',
  description:
    'A restaurant menu that shows each dish in AR at true scale, so guests can see the real portion size before they order. Next.js, Prisma and model-viewer.',
  path: '/work/tavola',
  card: 'tavola',
  type: 'article',
});

const p = getProject('tavola');

const steps: [string, string][] = [
  ['Scan the table code', 'A QR code on the table opens the menu. Nothing to install.'],
  ['Tap a dish', 'The menu is plain and mobile-first, with the portion facts on the card itself.'],
  [
    'See it at true size',
    'The dish appears on the table in front of you at real-world scale, through the phone camera.',
  ],
];

export default function TavolaPage() {
  const hasShot = publicFileExists(p.image);

  return (
    <CaseStudy
      project={p}
      hero={{
        title: 'Tavola',
        k: 0.2405,
        km: 0.2405,
        lead: 'A menu that shows you how big the dish actually is, before you order it.',
        role: 'Personal project, sole developer',
      }}
    >
      {hasShot && (
        <Frame
          src={p.image}
          alt="The Tavola menu and dish viewer"
          url={p.url}
          href={`https://${p.url}`}
          priority
        />
      )}

      <Band />

      <section className="sec wrap" aria-labelledby="idea-h">
        <SectionHead id="idea-h" title="The point" accent={p.accent} note="Portion transparency, not AR for its own sake." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              The interesting part is not the AR. It is portion transparency. Menu photography is shot
              to flatter, so the gap between the picture and the plate is where complaints come from.
            </p>
            <p>
              If a guest can see the real size, weight and how many people it serves before ordering,
              that argument does not happen.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="how-h">
        <SectionHead id="how-h" title="How it works" accent={p.accent} note="Three steps at the table." />
        <Steps items={steps} />
      </section>

      <Band />

      <section className="sec wrap" aria-labelledby="app-h">
        <SectionHead id="app-h" title="A full app, not a demo page" size="mid" />
        <div className="prose">
          <p className="label small">Behind the menu</p>
          <div className="txt">
            <p>
              It is a full app rather than a demo page. Restaurants sign in, add and reorder dishes,
              upload the models, and print a QR code per table. Every AR launch is recorded, which is
              the number that tells you whether guests actually use it or just tap once out of
              curiosity.
            </p>
            <p>
              The AR itself leans on <code>model-viewer</code>, which hands off to Scene Viewer on
              Android and Quick Look on iOS. That was a deliberate choice over building the viewer
              myself. Native handoff gets accurate real-world scale and lighting for free, and on a
              phone at a dinner table that matters more than control over the render.
            </p>
            <p className="note small">
              <b>Heads up:</b> it runs on demo data. The dishes are examples and the models are
              stand-ins rather than real scanned food, so treat the portions as a demonstration of the
              idea.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          cols={3}
          items={[
            ['Built with', 'Next.js, TypeScript, Tailwind'],
            ['Data', 'Prisma, PostgreSQL'],
            ['3D and AR', 'model-viewer, Scene Viewer, Quick Look'],
            ['Role', 'Sole developer'],
            ['Live at', 'tavola-menu.vercel.app', 'https://tavola-menu.vercel.app/'],
            ['Source', 'github.com/Brkic365/tavola', 'https://github.com/Brkic365/tavola'],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
