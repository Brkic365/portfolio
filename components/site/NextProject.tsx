import Image from 'next/image';
import Link from 'next/link';
import { featured, galleryIndex, type Project } from '@/data/projects';

/** The link to the next case study in the chain. */
export default function NextProject({ project: p }: { project: Project }) {
  return (
    <section className="wrap" aria-label="Next project" style={{ borderTop: '1px solid var(--line)' }}>
      <Link className="nextp" href={`/work/${p.slug}`}>
        <div>
          <span className="k small">
            Next project, {galleryIndex(p.slug)} of {featured.length}
          </span>
          <span className="name disp">
            {p.name} <span className="arr" aria-hidden="true">&rarr;</span>
          </span>
          <span className="line">{p.line}.</span>
        </div>
        <figure className={p.lift ? 'lift' : undefined}>
          <Image src={p.image} alt="" fill sizes="(max-width: 820px) 92vw, 40vw" />
        </figure>
      </Link>
    </section>
  );
}
