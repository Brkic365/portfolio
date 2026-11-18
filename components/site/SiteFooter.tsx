import Link from 'next/link';
import Knockout from '@/components/field/Knockout';
import { publicFileExists } from '@/lib/publicAssets';

/** The contact block that closes every page: the email as a field knockout. */
export default function SiteFooter({ accent }: { accent?: string }) {
  const hasResume = publicFileExists('resume.pdf');
  return (
    <footer className="contact" id="contact">
      <div className="wrap">
        <p className="k">Open to full-time roles. I can start immediately.</p>
        <Knockout
          as="a"
          href="mailto:contact@antoniobrkic.com"
          className="mail disp"
          wrapClassName="mail-wrap"
          preset="mail"
          accent={accent}
        >
          contact@
          <br className="mbr" />
          antoniobrkic.com
        </Knockout>
        <div className="links">
          <Link href="/contact">Write to me here</Link>
          <a href="https://github.com/Brkic365" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/antonio-brkic" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {hasResume && <a href="/resume.pdf">Résumé (PDF)</a>}
        </div>
        <div className="colo small">
          <span>Antonio Brkić, Zagreb</span>
          <span>Set in Archivo. The field is curl noise on a 2D canvas.</span>
        </div>
      </div>
    </footer>
  );
}
