import CaseStudy from '@/components/site/CaseStudy';
import Facts from '@/components/site/Facts';
import Frame from '@/components/site/Frame';
import Band from '@/components/site/Band';
import SectionHead from '@/components/site/SectionHead';
import { getProject } from '@/data/projects';
import { pageMetadata } from '@/lib/meta';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata = pageMetadata({
  title: 'Vectra XR',
  description:
    'Co-founder and CEO of Vectra XR, a 3D product configurator with WebAR for manufacturers selling custom hardware and prefab homes.',
  path: '/work/vectraxr',
  card: 'vectraxr',
  type: 'article',
});

const p = getProject('vectraxr');

const verticals: [string, string, string, string][] = [
  [
    'Fitness',
    'Sell the rack, not the spec sheet.',
    'Customers configure a rack or rig, pick attachments, watch dimensions update, then point a phone at their garage and see it at full scale. The system blocks combinations that will not ship.',
    'demo.vectraxr.com',
  ],
  [
    'Properties',
    'Sell the home before it is built.',
    'Buyers explore a prefab home in 3D before construction starts. Each prospect gets a private link to their own version, with the finishes and layout they chose, on any device.',
    'casademo.vectraxr.com',
  ],
];

export default function VectraXRPage() {
  const hasShot = publicFileExists(p.image);
  const hasConfigurator = publicFileExists('projects/vectraxr-configurator.png');

  return (
    <CaseStudy
      project={p}
      hero={{
        title: (
          <>
            Vectra
            <br className="mbr" /> XR
          </>
        ),
        k: 0.1574,
        km: 0.2369,
        lead: 'A 3D configurator for products people buy before they exist.',
        role: 'Co-founder and CEO',
      }}
    >
      {hasShot && (
        <Frame src={p.image} alt="The Vectra XR configurator" url={p.url} href={`https://${p.url}`} priority />
      )}

      <Band />

      <section className="sec wrap" aria-labelledby="prob-h">
        <SectionHead id="prob-h" title="The problem" accent={p.accent} note="Five-figure decisions, sold with photos." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">Static photos do not close five-figure decisions.</p>
            <p>
              When someone is about to commit to a custom rig, or to the home they will live in for the
              next decade, they need to see their configuration, in their space, at full scale. Most
              manufacturers still sell that with photoshoots that go stale and PDF spec sheets that come
              back with the same questions every time.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-labelledby="vert-h">
        <SectionHead id="vert-h" title="Two verticals" size="mid" />
        <div className="pairs">
          {verticals.map(([label, headline, body, demo]) => (
            <div className="pair" key={label}>
              <span className="k small">{label}</span>
              <h3>{headline}</h3>
              <p>{body}</p>
              <a className="go ul" href={`https://${demo}`} target="_blank" rel="noopener noreferrer">
                Try the live configurator
              </a>
            </div>
          ))}
        </div>
      </section>

      {hasConfigurator && (
        <Frame
          src="/projects/vectraxr-configurator.png"
          alt="The Vectra XR product configurator"
          url="demo.vectraxr.com"
          href="https://demo.vectraxr.com"
          caption={['demo.vectraxr.com', 'The configurator, running in the browser.']}
        />
      )}

      <section className="sec flush wrap" aria-label="Project facts">
        <Facts
          items={[
            ['Role', 'Co-founder'],
            ['I own', 'Frontend architecture, 3D pipeline, code review'],
            ['Team', 'Three founders, no outside investors'],
            ['Runs in', 'The browser. No app, no headset'],
          ]}
        />
      </section>

      <Band />

      <section className="sec wrap" aria-labelledby="eng-h">
        <SectionHead id="eng-h" title="Engineering" accent={p.accent} note="A browser tab on a phone the customer already owns." />
        <div className="prose">
          <div />
          <div className="txt">
            <p className="big">
              The whole thing has to run in a browser tab on a phone a customer already owns. That
              constraint decides most of the engineering.
            </p>
            <p>
              Every product is one 3D model with variants generated on demand rather than a model per
              combination, and the assets have to be light enough to load over mobile data while still
              looking like the thing someone is about to spend five figures on.
            </p>
            <p>
              Getting a client&rsquo;s CAD files into something a browser can load is its own problem,
              so that runs as a separate Python service. Conversions are cached against a hash of the
              source file, which means the same model is never converted twice, and a failed conversion
              has defined behaviour rather than leaving a product half-broken in the catalogue.
            </p>
            <p>
              It also has to drop into someone else&rsquo;s storefront. The configurator embeds into
              Shopify, WooCommerce or Webflow with a single tag, so it has to behave inside a page it
              does not control.
            </p>
          </div>
        </div>
      </section>

      <section className="sec flush wrap" aria-label="Stack">
        <Facts
          items={[
            ['Frontend', 'Turborepo monorepo, Next.js App Router'],
            ['Data', 'Prisma, PostgreSQL, REST and JSON APIs'],
            ['Auth', 'Clerk, OAuth and OIDC'],
            ['3D pipeline', 'Python and Flask, cached on object storage'],
          ]}
        />
      </section>
    </CaseStudy>
  );
}
