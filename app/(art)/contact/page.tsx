import ContactForm from '@/components/art/ContactForm';
import Knockout from '@/components/field/Knockout';
import Band from '@/components/site/Band';
import TopNav from '@/components/site/TopNav';
import { pageMetadata } from '@/lib/meta';
import { publicFileExists } from '@/lib/publicAssets';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Get in touch with Antonio Brkić, full-stack developer in Zagreb, about work, roles or collaboration.',
  path: '/contact',
  card: 'home',
});

export default function ContactPage() {
  const hasResume = publicFileExists('resume.pdf');
  return (
    <>
      <header className="hero contact-hero wrap" id="top">
        <TopNav current="contact" />
        <Knockout as="h1" preset="quiet" minSize={0}>
          Get in touch
        </Knockout>
      </header>

      <Band />

      <main className="sec wrap">
        <div className="contact-grid">
          <aside>
            <p>Open to full-time roles, and happy to talk about freelance work.</p>
            <ul className="small">
              <li>
                <a href="mailto:contact@antoniobrkic.com">contact@antoniobrkic.com</a>
              </li>
              <li>
                <a href="https://github.com/Brkic365" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/antonio-brkic" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              {hasResume && (
                <li>
                  <a href="/resume.pdf">Résumé (PDF)</a>
                </li>
              )}
            </ul>
          </aside>
          <ContactForm />
        </div>
        <div className="colo small" style={{ marginTop: 0 }}>
          <span>Antonio Brkić, Zagreb, Croatia</span>
          <span>Set in Archivo. The field is curl noise on a 2D canvas.</span>
        </div>
      </main>
    </>
  );
}
