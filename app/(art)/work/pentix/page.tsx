import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';

export const metadata: Metadata = {
  title: 'Pentix',
  description:
    'A World Cup wager app where pose estimation running in the browser counts your push-ups, built with Next.js, MediaPipe and Supabase.',
  alternates: { canonical: '/work/pentix' },
};

const theme = projectThemes.pentix;

const steps: [string, string][] = [
  [
    'A goal is scored',
    'Match data turns into push-ups you owe, using a formula each group sets for itself.',
  ],
  [
    'The debt grows',
    'Unpaid balances gain interest, so putting it off costs you.',
  ],
  [
    'The camera settles it',
    'Pose tracking runs on your own phone and counts the set. The video never leaves the device.',
  ],
];

export default function PentixPage() {
  return (
    <div className="art" data-theme="pentix" style={themeVars(theme)}>
      <main>
        <section className="art-pad pt-[20vh] pb-[10vh]">
          <div className="art-mono mb-8" style={{ color: 'var(--accent)' }}>
            Personal project, live at pentix.eu
          </div>
          <h1
            className="art-display art-enter art-enter-2"
            style={{ fontSize: 'clamp(3.5rem, 17vw, 18rem)', color: 'var(--ink)' }}
          >
            Pentix
          </h1>
          <div
            className="mt-[6vh] flex flex-wrap items-end justify-between gap-8"
            style={{ borderTop: '3px solid var(--accent)', paddingTop: '2rem' }}
          >
            <p
              className="art-serif"
              style={{
                fontSize: 'clamp(1.2rem, 2.6vw, 2.1rem)',
                lineHeight: 1.3,
                color: 'var(--ink)',
                maxWidth: '26ch',
              }}
            >
              A bet with your friends that a camera keeps honest, instead of the
              honour system.
            </p>
            <a
              href="https://pentix.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="art-mono"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.9em 1.4em',
              }}
            >
              Open the app
            </a>
          </div>
        </section>

        <section
          className="art-pad py-[10vh] grid md:grid-cols-3 gap-x-10 gap-y-12"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          {steps.map(([title, body], i) => (
            <div key={title}>
              <div
                className="art-display mb-5"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', color: 'var(--accent)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h2
                className="art-display mb-3"
                style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', color: 'var(--ink)' }}
              >
                {title}
              </h2>
              <p
                className="art-serif"
                style={{ fontSize: '1.05rem', lineHeight: 1.55, color: 'var(--ink-2)' }}
              >
                {body}
              </p>
            </div>
          ))}
        </section>

        <section className="art-pad py-[9vh]">
          <Shot
            src="/projects/pentix.png"
            alt="The Pentix leaderboard and match interface"
            url="pentix.eu"
            lift
            ratio="16 / 10"
            sizes="(max-width: 1024px) 92vw, 82vw"
          />
        </section>

        <section className="art-pad py-[10vh] grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-20">
          <div
            className="art-serif"
            style={{ fontSize: '1.2rem', lineHeight: 1.65, color: 'var(--ink-2)' }}
          >
            <p>
              Running the model on the phone was a product decision before it was
              a technical one. Uploading video would have meant storage costs, a
              moderation problem, and asking people to hand over footage of
              themselves. Keeping it on the device removed all three.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              The hard part was deciding what counts as a rep. It comes down to
              one number: how far your elbow has to bend before the app accepts
              the push-up. Set it too loose and half reps count, which defeats
              the point. Set it too strict and good reps get ignored, so people
              end up doing more push-ups than they actually owe. Almost all of
              the tuning went into that single threshold, and getting it wrong in
              either direction makes people stop trusting the app.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-8 self-start">
            {[
              ['Built with', 'Next.js, MediaPipe, Supabase'],
              ['Role', 'Sole developer'],
              ['Status', 'Live and in use'],
              ['Runs on', 'Your device, not a server'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="art-mono mb-2" style={{ color: 'var(--ink-3)' }}>
                  {k}
                </dt>
                <dd className="art-serif" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
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
