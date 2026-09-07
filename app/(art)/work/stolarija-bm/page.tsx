import type { Metadata } from 'next';
import Link from 'next/link';
import Shot from '@/components/art/Shot';
import { projectThemes, themeVars } from '@/data/projectThemes';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata: Metadata = {
  title: 'Stolarija-BM',
  description:
    'A catalogue, web shop and admin dashboard built for a custom furniture workshop, using Next.js, TypeScript and Supabase.',
  alternates: { canonical: '/work/stolarija-bm' },
};

const theme = projectThemes['stolarija-bm'];

export default function StolarijaPage() {
  const hasAdminShot = publicFileExists('projects/stolarija-bm-admin.png');

  return (
    <div className="art" data-theme="stolarija-bm" style={themeVars(theme)}>
      <main>
        <section className="art-pad pt-[16vh] pb-[8vh]">
          <div className="art-mono mb-6">
            <span
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                padding: '0.45em 0.8em',
                display: 'inline-block',
              }}
            >
              Client work
            </span>
          </div>
          <h1
            className="art-display art-enter art-enter-2"
            style={{ fontSize: 'clamp(2.8rem, 11vw, 11rem)', color: 'var(--ink)' }}
          >
            Stolarija
            <br />
            BM
          </h1>
          <p
            className="art-serif mt-10"
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.75rem)',
              lineHeight: 1.35,
              color: 'var(--ink-2)',
              maxWidth: '32ch',
            }}
          >
            A catalogue and web shop for a furniture workshop, plus the admin
            side they use to run it.
          </p>
        </section>

        <section className="art-pad pb-[10vh]">
          <Shot
            src="/projects/stolarija-bm.png"
            alt="The Stolarija-BM catalogue"
            url="stolarijabm.vercel.app"
            lift
            priority
            ratio="16 / 9"
            sizes="(max-width: 1024px) 92vw, 82vw"
          />
          <figcaption className="art-mono mt-4" style={{ color: 'var(--ink-3)' }}>
            The public catalogue
          </figcaption>
        </section>

        <section
          className="art-pad py-[8vh]"
          style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}
        >
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {[
              ['Role', 'Sole developer and designer'],
              ['Built with', 'Next.js, TypeScript, Supabase'],
              ['Status', 'Live on a temporary Vercel URL'],
              ['Web shop', 'Waiting on client content'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="art-mono mb-2" style={{ color: 'var(--ink-3)' }}>
                  {k}
                </dt>
                <dd className="art-serif" style={{ fontSize: '1.15rem', color: 'var(--ink)' }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="art-pad py-[10vh]">
          <div
            className="art-serif"
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.65,
              color: 'var(--ink-2)',
              maxWidth: '38rem',
            }}
          >
            <p>
              The workshop builds furniture to order, so the site had to sell the
              work rather than list stock. Behind the public pages there is an
              admin area where staff handle inventory, orders and customer
              messages in one place, without needing to be walked through it.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              It is running on a temporary Vercel URL for now. The real domain is
              bought and waiting, and it gets pointed at the site once the shop
              has products in it.
            </p>
            <p style={{ marginTop: '1.2em' }}>
              That last part has been the hard bit, and it is not the code. The
              web shop cannot open until the client photographs their products
              and writes descriptions for them, and how good the whole thing
              looks rests on that. It is the first project I have built that sits
              finished, waiting on someone else. If I did it again I would start
              collecting the product content in week one instead of leaving it to
              the end.
            </p>
          </div>
        </section>

        {hasAdminShot && (
          <section className="art-pad pb-[10vh]">
            <Shot
              src="/projects/stolarija-bm-admin.png"
              alt="The Stolarija-BM admin dashboard"
              url="stolarijabm.vercel.app/admin"
              ratio="16 / 9"
              sizes="(max-width: 1024px) 92vw, 82vw"
            />
            <figcaption className="art-mono mt-4" style={{ color: 'var(--ink-3)' }}>
              The admin dashboard
            </figcaption>
          </section>
        )}

        <nav
          className="art-pad py-[8vh] flex flex-wrap items-baseline justify-between gap-6"
          style={{ borderTop: '1px solid var(--rule)' }}
        >
          <Link href="/" className="art-mono" style={{ color: 'var(--ink-3)' }}>
            Back to index
          </Link>
          <Link
            href="/work/tavola"
            className="art-display"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: 'var(--ink)' }}
          >
            Tavola
          </Link>
        </nav>
      </main>
    </div>
  );
}
