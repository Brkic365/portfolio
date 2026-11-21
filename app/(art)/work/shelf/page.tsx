import Band from '@/components/site/Band';
import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import SectionHead from '@/components/site/SectionHead';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata = pageMetadata({
  title: 'Shelf',
  description:
    'Tell it which bottles you own and it works out what you can pour tonight, then which single bottle would unlock the most new drinks.',
  path: '/work/shelf',
  card: 'shelf',
  type: 'article',
});

const p = getProject('shelf');

export default function ShelfPage() {
  const hasShot = publicFileExists(p.image);

  return (
    <CaseStudy
      project={p}
      hero={{
        title: 'Shelf',
        k: 0.3076,
        km: 0.3076,
        lead: 'What you can pour from the bottles you already own, and which one more would change the most.',
        role: 'Personal project, sole developer',
      }}
    >
      {hasShot && (
        <Frame
          src={p.image}
          alt="The Shelf ingredient picker and drink count"
          url={p.url}
          href={`https://${p.url}/`}
          lift
          priority
        />
      )}

      <Band />

      <section className="sec wrap" aria-labelledby="q-h">
        <SectionHead id="q-h" title="The question" accent={p.accent} note="Recipe sites answer the wrong one." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              Recipe sites answer the wrong question. They tell you how to make a drink you have already
              chosen, then send you to a shop.
            </p>
            <p>
              The question people actually have is the reverse one: given what is already on the shelf,
              what can I make tonight without going anywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="two-h">
        <SectionHead id="two-h" title="Two questions" size="mid" />
        <div className="pairs">
          <div className="pair">
            <span className="k small">Question one</span>
            <h3>What can I pour right now?</h3>
            <p>
              Tick the bottles you own and the count updates as you go. Water and ice are treated as
              implied rather than something you have to declare, and a loose mode lets near-enough
              substitutions count, so a recipe calling for gold rum is not blocked by owning white.
            </p>
          </div>
          <div className="pair">
            <span className="k small">Question two</span>
            <h3>What should I buy next?</h3>
            <p>
              This is the one worth building. For every bottle you do not own, work out how many drinks
              it would unlock given everything you do, then rank them. The answer changes completely
              depending on what is already there, which is why a generic list of essentials is never
              much use to anyone.
            </p>
          </div>
        </div>
      </section>

      <Band />

      <section className="sec wrap" aria-labelledby="data-h">
        <SectionHead id="data-h" title="The data" accent={p.accent} />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">The maths is simple. The recipe data is not.</p>
            <p>
              Recipe sources name the same thing a dozen ways, so the ingredient list has to be
              normalised into a single vocabulary before any of the counting means anything. Get that
              wrong and the answers are confidently incorrect, which is worse than no answer.
            </p>
            <p>
              Everything is shareable by link, so a shelf can be sent to someone else without an account
              or a login.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Built with', 'Next.js, TypeScript'],
            ['Role', 'Sole developer'],
            ['Live at', 'cocktailshelf.vercel.app', 'https://cocktailshelf.vercel.app/'],
            ['Source', 'Private for now'],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
