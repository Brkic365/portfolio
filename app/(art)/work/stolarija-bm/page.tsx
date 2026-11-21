import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata = pageMetadata({
  title: 'Stolarija-BM',
  description:
    'A catalogue, web shop and admin dashboard built for a custom furniture workshop, using Next.js, TypeScript and Supabase.',
  path: '/work/stolarija-bm',
  card: 'stolarija-bm',
  type: 'article',
});

const p = getProject('stolarija-bm');

export default function StolarijaPage() {
  const hasAdminShot = publicFileExists('projects/stolarija-bm-admin.png');

  return (
    <CaseStudy
      project={p}
      hero={{
        title: (
          <>
            Stolarija-
            <br className="mbr" />
            BM
          </>
        ),
        k: 0.1302,
        km: 0.1781,
        lead: 'A catalogue and web shop for a furniture workshop, plus the admin side they use to run it.',
        role: 'Client work, sole developer and designer',
      }}
    >
      <Frame
        src={p.image}
        alt="The Stolarija-BM catalogue"
        url={p.url}
        href={`https://${p.url}`}
        lift
        priority
        caption={['Client work', 'The public catalogue.']}
      />

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Role', 'Sole developer and designer'],
            ['Built with', 'Next.js, TypeScript, Supabase'],
            ['Status', 'Live on a temporary Vercel URL'],
            ['Web shop', 'Waiting on client content'],
          ]}
        />
      </section>

      <Band />

      <section className="sec wrap" aria-labelledby="job-h">
        <SectionHead id="job-h" title="The job" accent={p.accent} />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              The workshop builds furniture to order. There is no stock to list, so the site shows
              finished pieces and takes enquiries.
            </p>
            <p>
              Behind the public pages there is an admin area where staff handle inventory, orders and
              customer messages in one place, without needing to be walked through it.
            </p>
            <p>
              It is running on a temporary Vercel URL for now. The real domain is bought and waiting,
              and it gets pointed at the site once the shop has products in it.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="wait-h">
        <SectionHead id="wait-h" title="Still waiting" size="mid" />
        <div className="prose">
          <p className="label small">Content</p>
          <div className="txt">
            <p>
              The web shop cannot open
              until the client photographs their products and writes descriptions for them, and how
              good the whole thing looks depends on that. The code has been done for a while.
            </p>
            <p className="big">
              If I did it again I would start collecting the product content in week one, not leave it to
              the end.
            </p>
          </div>
        </div>
      </section>

      {hasAdminShot && (
        <Frame
          src="/projects/stolarija-bm-admin.png"
          alt="The Stolarija-BM admin dashboard"
          url={`${p.url}/admin`}
          caption={['Admin', 'The admin dashboard.']}
        />
      )}
    </CaseStudy>
  );
}
