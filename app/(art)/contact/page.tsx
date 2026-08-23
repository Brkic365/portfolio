import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/art/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Antonio Brkić, full-stack developer in Zagreb, about work, roles or collaboration.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main className="art-pad flex flex-col justify-between" style={{ minHeight: '100svh' }}>
      <div style={{ paddingTop: 'clamp(2.5rem, 7vh, 5rem)' }}>
        <Link href="/" className="art-mono" style={{ color: 'var(--ink-3)' }}>
          Back to index
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-x-16 gap-y-10 py-[6vh]">
        <div>
          <h1
            className="art-display mb-6"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', color: 'var(--ink)' }}
          >
            Get in
            <br />
            touch
          </h1>
          <p
            className="art-serif"
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
              lineHeight: 1.5,
              color: 'var(--ink-2)',
              maxWidth: '26ch',
            }}
          >
            Open to full-time roles, and happy to talk about freelance work.
          </p>
          <div className="art-mono flex flex-wrap gap-x-6 gap-y-2 mt-8" style={{ color: 'var(--ink-3)' }}>
            <a href="https://github.com/Brkic365" target="_blank" rel="noopener noreferrer" className="art-link">
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/antonio-brkic"
              target="_blank"
              rel="noopener noreferrer"
              className="art-link"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <ContactForm />
      </div>

      <div className="art-mono py-6" style={{ color: 'var(--ink-3)' }}>
        Zagreb, Croatia
      </div>
    </main>
  );
}
