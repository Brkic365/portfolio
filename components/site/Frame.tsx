import Image from 'next/image';
import ExtArrow from './ExtArrow';
import type { ReactNode } from 'react';

/**
 * A screenshot in window chrome, as a quoted object rather than a backdrop.
 * A UI capture carries its own headlines; putting site type on top of it puts
 * two type systems in one space, so it is never full-bleed and never behind
 * text. Server component, no client JavaScript.
 */
export default function Frame({
  src,
  alt,
  url,
  href,
  lift = false,
  ratio = '16 / 9',
  caption,
  priority = false,
  tight = false,
  sizes = '(max-width: 820px) 94vw, 92vw',
}: {
  src: string;
  alt: string;
  /** Shown in the chrome, usually the live address. */
  url: string;
  /** Makes the address a link. */
  href?: string;
  /** Shadow lift for near-black captures. */
  lift?: boolean;
  /** Visible area, as a CSS aspect-ratio. The capture is cropped from the top. */
  ratio?: string;
  caption?: [ReactNode, ReactNode];
  priority?: boolean;
  tight?: boolean;
  sizes?: string;
}) {
  return (
    <section className={`shot wrap${tight ? ' tight' : ''}`} aria-label="Screenshot">
      <figure>
        <div className={`frame${lift ? ' lift' : ''}`}>
          <div className="chrome small">
            <span className="dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            {href ? (
              <a className="url" href={href} target="_blank" rel="noopener noreferrer">
                {url} <ExtArrow />
              </a>
            ) : (
              <span className="url">{url}</span>
            )}
          </div>
          <div className="img" style={{ aspectRatio: ratio }}>
            <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
          </div>
        </div>
        {caption && (
          <figcaption className="small">
            <span>{caption[0]}</span>
            <span>{caption[1]}</span>
          </figcaption>
        )}
      </figure>
    </section>
  );
}
