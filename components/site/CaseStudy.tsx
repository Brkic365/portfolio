import type { ReactNode } from 'react';
import Band from '@/components/site/Band';
import CaseHero from '@/components/site/CaseHero';
import NextProject from '@/components/site/NextProject';
import SiteFooter from '@/components/site/SiteFooter';
import { nextProject, type Project } from '@/data/projects';

/**
 * The frame every case study shares: the project's accent on the page, the
 * hero, then the page's own sections, then the next project and the footer.
 * What happens in between is up to each page.
 */
export default function CaseStudy({
  project,
  hero,
  children,
  end,
}: {
  project: Project;
  hero: Omit<React.ComponentProps<typeof CaseHero>, 'project'>;
  children: ReactNode;
  /** Replaces the next-project link, for pages outside the chain. */
  end?: ReactNode;
}) {
  const next = nextProject(project.slug);
  return (
    <div className="field-page" style={{ '--page-acc': project.accent } as React.CSSProperties}>
      <CaseHero project={project} {...hero} />
      <main>
        {children}
        {end ?? (next && <NextProject project={next} />)}
      </main>
      <Band accent={project.accent} sig={project.sig} />
      <SiteFooter accent={project.accent} />
    </div>
  );
}
