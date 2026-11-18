import Link from 'next/link';
import type { ReactNode } from 'react';
import FieldCanvas from '@/components/field/FieldCanvas';
import TopNav from '@/components/site/TopNav';
import { featured, galleryIndex, type Project } from '@/data/projects';

/**
 * The top of a case study: nav, crumb, the project name as a knockout traced
 * by a field in the project's own signature and accent, the lead and the meta
 * row.
 *
 * The title carries the view-transition-name the gallery uses, so clicking a
 * project's name on the homepage morphs it into this one.
 */
export default function CaseHero({
  project: p,
  title,
  k,
  km,
  lead,
  role,
}: {
  project: Project;
  /** The name, with optional <br className="mbr" /> breaks for narrow screens. */
  title: ReactNode;
  /** 1 / title width in em on one line, so the name spans the hero. */
  k: number;
  /** The same for the narrow layout, using its widest line. */
  km: number;
  lead: string;
  role: string;
}) {
  const n = galleryIndex(p.slug);
  const href = `https://${p.url}`;
  return (
    <header className="hero case" id="top">
      <FieldCanvas preset="case" trace="case-title" sig={p.sig} accent={p.accent} />
      <TopNav current="work" />
      <div className="crumb wrap small">
        <Link href="/#work">&larr; Selected work</Link>
        {n ? (
          <span>
            <b>{n}</b> of {featured.length}
          </span>
        ) : (
          <span>
            <b>More work</b>
          </span>
        )}
      </div>
      <h1
        id="case-title"
        className="hero-t ko vt-title"
        style={{ '--k': k, '--km': km, viewTransitionName: 'project-title' } as React.CSSProperties}
      >
        {title}
      </h1>
      <div className="hero-foot wrap">
        <p className="case-lead">{lead}</p>
        <dl className="meta small">
          <div>
            <dt>Role</dt>
            <dd>{role}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{p.stack}</dd>
          </div>
          <div>
            <dt>{p.urlLabel}</dt>
            <dd>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {p.url}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
