import Link from 'next/link';
import { publicFileExists } from '@/lib/publicAssets';

/**
 * The nav row at the top of every hero. On the homepage the links are
 * in-page anchors; elsewhere they point back into the homepage, except
 * Contact, which always lands on the footer of the current page.
 */
export default function TopNav({ home = false, current }: { home?: boolean; current?: 'work' | 'contact' }) {
  const base = home ? '' : '/';
  const hasResume = publicFileExists('resume.pdf');
  return (
    <div className="top wrap small">
      <Link className="me" href={home ? '#top' : '/'}>
        Antonio Brkić
      </Link>
      <nav aria-label="Main">
        <Link href={`${base}#work`} aria-current={current === 'work' ? 'page' : undefined}>
          Work
        </Link>
        <Link className="opt" href={`${base}#experience`}>
          Experience
        </Link>
        <Link href={`${base}#about`}>About</Link>
        <Link href={current === 'contact' ? '/contact' : '#contact'} aria-current={current === 'contact' ? 'page' : undefined}>
          Contact
        </Link>
        {hasResume && (
          <a className="opt" href="/resume.pdf">
            Résumé
          </a>
        )}
      </nav>
    </div>
  );
}
