import Image from 'next/image';

interface ShotProps {
  src: string;
  alt: string;
  /** Shown in the window chrome. Usually the project's live domain. */
  url: string;
  /** Lift shadows on near-black screenshots so they don't read as empty. */
  lift?: boolean;
  priority?: boolean;
  /** CSS aspect-ratio for the viewport area, e.g. '16 / 10'. */
  ratio?: string;
  /**
   * Rendered width hint for the image loader. Keep this honest — it decides
   * which source variant is served, and getting it wrong is what makes a
   * screenshot look soft.
   */
  sizes?: string;
}

/**
 * A screenshot presented as a quoted object rather than a backdrop.
 *
 * Server component — no client JavaScript. The hover lift lives in CSS on
 * `.art-band:hover .art-shot`, so this stays static.
 */
export default function Shot({
  src,
  alt,
  url,
  lift = false,
  priority = false,
  ratio = '16 / 10',
  sizes = '(max-width: 1024px) 92vw, 46vw',
}: ShotProps) {
  return (
    <figure className={`art-shot ${lift ? 'art-lift' : ''}`}>
      <div className="art-shot-bar">
        <span className="art-shot-dot" />
        <span className="art-shot-dot" />
        <span className="art-shot-dot" />
        <span className="art-shot-url">{url}</span>
      </div>
      <div className="art-shot-media" style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </div>
    </figure>
  );
}
