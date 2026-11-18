import Image from 'next/image';
import Link from 'next/link';
import FieldCanvas from '@/components/field/FieldCanvas';
import Gallery from '@/components/field/Gallery';
import Band from '@/components/site/Band';
import SectionHead from '@/components/site/SectionHead';
import SiteFooter from '@/components/site/SiteFooter';
import TopNav from '@/components/site/TopNav';
import { featured, more, signatureAccents } from '@/data/projects';
import { activityLabel, getActivity } from '@/lib/activity';
import { pageMetadata } from '@/lib/meta';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata = pageMetadata({
  description:
    'Antonio Brkić is a full-stack developer in Zagreb building web apps with Next.js, TypeScript and PostgreSQL. Client work, college projects and things built for fun.',
  path: '/',
  card: 'home',
});

interface Role {
  period: string;
  role: string;
  org: string;
  /** Set when the organisation has a page here. */
  href?: string;
  note: string;
}

const experience: Role[] = [
  {
    period: 'Feb to May 2026',
    role: 'Junior QA Engineer',
    org: 'Porsche eBike Performance',
    note: 'Sole active QA on the mobile app, owning test planning, execution and reporting across iOS and Android. Wrote Appium automation for regression flows so repeatable checks stopped depending on someone walking through the app by hand, and tested gRPC and HTTP endpoints against the application contract rather than only through the interface. International team, English as the working language. The role ended when the site closed.',
  },
  {
    period: '2021 to now',
    role: 'Full-stack developer, freelance',
    org: 'Self-employed',
    note: 'Client work end to end: scoping, build, testing, deployment and maintenance in production. Branch workflow with pull requests, and GitHub Actions so projects deploy on merge rather than by hand.',
  },
  {
    period: 'Dec 2025 to now',
    role: 'Co-founder and developer',
    org: 'Vectra XR',
    href: '/work/vectraxr',
    note: 'Led the frontend architecture, wrote the Python service that converts 3D files, and ran code review and the release process for two other engineers.',
  },
];

const facts: [string, string][] = [
  ['Based in', 'Zagreb, Croatia'],
  ['Studying', 'Computer engineering at TVZ, graduating June 2027'],
  ['Working with', 'TypeScript, Next.js, Node, PostgreSQL, Python'],
  ['Availability', 'Open to full-time roles, can start immediately'],
];

export default async function Home() {
  const commits = await getActivity();
  // First of these that exists gets used, so the photo can move without a code change.
  const portrait = ['images/antonio-brkic.jpg', 'avatar.jpg', 'avatar.png'].find(publicFileExists);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────
          The name is real text; the field traces it. On the first visit
          of a session the letters assemble out of scattered particles. */}
      <header className="hero" id="top">
        <FieldCanvas preset="hero" trace="hero-name" formOnce />
        <TopNav home />
        <h1 id="hero-name" className="hero-name ko">
          <span className="sr-only">Antonio Brkić</span>
          <span aria-hidden="true">
            Anto
            <br className="mbr" />
            nio
            <br />
            Brkić
          </span>
        </h1>
        <div className="hero-foot wrap">
          <p className="hero-lead">I build software with something moving in it.</p>
          <div className="hero-side small">
            <p>Full-stack developer in Zagreb. Open to full-time roles.</p>
            <div className="acts">
              <a href="#work">See the work</a>
              <a href="#contact">Get in touch</a>
            </div>
            <p className="legend">
              <i aria-hidden="true" />
              <span className="fine">The field bends around your cursor.</span>
              <span className="coarse">Tap the field to stir it.</span>
            </p>
            <p className="act" title="Counted from public GitHub push events at build time">
              <b aria-hidden="true" />
              {activityLabel(commits)}
            </p>
          </div>
        </div>
      </header>

      <main>
        <Gallery
          projects={featured.map(({ slug, name, line, role, stack, url, urlLabel, image, lift, sig, accent }) => ({
            slug, name, line, role, stack, url, urlLabel, image, lift, sig, accent,
          }))}
          accents={signatureAccents}
        />

        <Band />

        {/* ── Experience ───────────────────────────────────────────────
            Employment goes above About. It is the part a recruiter is
            scanning for and the part a portfolio usually leaves out.    */}
        <section className="sec wrap" id="experience" aria-labelledby="exp-h">
          <SectionHead id="exp-h" title="Experience" note="Where I have been paid to build and test software." />
          {experience.map((e) => (
            <div className="job" key={e.role}>
              <div className="when">{e.period}</div>
              <div>
                <h3>{e.role}</h3>
                <div className="org">{e.href ? <Link href={e.href}>{e.org}</Link> : e.org}</div>
              </div>
              <p>{e.note}</p>
            </div>
          ))}
        </section>

        {/* ── About ────────────────────────────────────────────────────
            Sits after the work on purpose. Anyone scanning gets the projects
            first; this is here for the people who kept reading.            */}
        <section className="sec flush wrap" id="about" aria-labelledby="about-h">
          <SectionHead id="about-h" title="About" />
          <div className="about">
            <div>
              {portrait && (
                <figure>
                  <Image src={`/${portrait}`} alt="Portrait of Antonio Brkić" width={140} height={140} />
                  <figcaption className="small">Antonio, in Zagreb</figcaption>
                </figure>
              )}
            </div>
            <div className="txt">
              <p className="big">
                I build web apps, front to back. Most of what I actually know came from making things
                that had to work for someone other than me, whether that was a paying client, a course
                deadline or a group of friends who wanted to settle an argument.
              </p>
              <p>
                The work I enjoy most has something moving in it. Prices arriving over a socket, a
                camera counting reps, traffic rerouting itself around a closed road. Those problems have
                a right answer you can measure, and they break in interesting ways when you get them
                wrong.
              </p>
              <p>
                Day to day that means TypeScript, Next.js, Node and Postgres, with Python when the
                problem looks more like an algorithm than an app. I am comfortable owning something end
                to end, from the database up to the part a client has to be able to use without me
                sitting next to them.
              </p>
              <p>
                Four months as the only QA engineer on a mobile app changed how I write my own code.
                Testing, reproducing a defect properly and reading someone else&rsquo;s work carefully
                are habits now rather than things I mean to get around to. What I want next is a team
                where someone more experienced reviews what I write.
              </p>
              <dl className="facts small">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── More work ──────────────────────────────────────────────── */}
        <section className="sec flush wrap more" aria-labelledby="more-h">
          <SectionHead id="more-h" title="More work" size="mid" knockout note="Smaller projects, client sites and studies." />
          <ul>
            {more.map((m) => (
              <li key={m.name}>
                {m.internal ? (
                  <Link href={m.href}>
                    <b>{m.name}</b>
                    <span>{m.note}. Case study</span>
                  </Link>
                ) : (
                  <a href={m.href} target="_blank" rel="noopener noreferrer">
                    <b>
                      {m.name} <span className="ext" aria-hidden="true">↗</span>
                    </b>
                    <span>{m.note}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Band />
      <SiteFooter />
    </>
  );
}
