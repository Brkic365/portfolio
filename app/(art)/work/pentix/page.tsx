import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import Steps from '@/components/site/Steps';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';

export const metadata = pageMetadata({
  title: 'Pentix',
  description:
    'A World Cup wager app where pose estimation running in the browser counts your push-ups, built with Next.js, MediaPipe and Supabase.',
  path: '/work/pentix',
  card: 'pentix',
  type: 'article',
});

const p = getProject('pentix');

const steps: [string, string][] = [
  [
    'A goal is scored',
    'Match data turns into push-ups you owe, using a formula each group sets for itself.',
  ],
  ['The debt grows', 'Unpaid balances gain interest, so putting it off costs you.'],
  [
    'The camera settles it',
    'Pose tracking runs on your own phone and counts the set. The video never leaves the device.',
  ],
];

export default function PentixPage() {
  return (
    <CaseStudy
      project={p}
      hero={{
        title: 'Pentix',
        k: 0.2461,
        km: 0.2461,
        lead: 'A bet with your friends that a camera keeps honest, instead of the honour system.',
        role: 'Personal project, sole developer',
      }}
    >
      <section className="sec wrap" style={{ paddingTop: 'clamp(40px, 6vw, 88px)' }} aria-labelledby="how-h">
        <SectionHead id="how-h" title="How it works" accent={p.accent} note="Goals become push-ups. The camera keeps count." />
        <Steps items={steps} />
      </section>

      <Frame
        src={p.image}
        alt="The Pentix leaderboard and match interface"
        url={p.url}
        href={`https://${p.url}/`}
        lift
        ratio="16 / 10"
      />

      <Band />

      <section className="sec wrap" aria-labelledby="dev-h">
        <SectionHead id="dev-h" title="On the device" accent={p.accent} note="A product decision before it was a technical one." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              Running the model on the phone was a product decision before it was a technical one.
            </p>
            <p>
              Uploading video would have meant storage costs, a moderation problem, and asking people to
              hand over footage of themselves. Keeping it on the device removed all three.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="rep-h">
        <SectionHead id="rep-h" title="What counts as a rep" size="mid" />
        <div className="prose">
          <p className="label small">One threshold</p>
          <div className="txt">
            <p>
              The hard part was deciding what counts as a rep. It comes down to one number: how far your
              elbow has to bend before the app accepts the push-up. Set it too loose and half reps count,
              which defeats the point. Set it too strict and good reps get ignored, so people end up
              doing more push-ups than they actually owe.
            </p>
            <p className="big">
              Almost all of the tuning went into that single threshold, and getting it wrong in either
              direction makes people stop trusting the app.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Built with', 'Next.js, MediaPipe, Supabase'],
            ['Role', 'Sole developer'],
            ['Live at', 'pentix.eu', 'https://pentix.eu/'],
            ['Runs on', 'Your device, not a server'],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
