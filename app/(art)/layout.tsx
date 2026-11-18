import Backdrop from '@/components/field/Backdrop';
import FieldTuning from '@/components/field/FieldTuning';
import { signatureAccents } from '@/data/projects';
import { getActivity } from '@/lib/activity';

/**
 * Wrapper for every page of the site.
 *
 * Holds the background field that runs behind every page, the shadow-lift
 * filter for near-black screenshots, and passes the build-time GitHub activity
 * to the field engine, which maps it to how fast and dense every field runs.
 * FieldTuning comes first so its effect has run before the backdrop builds.
 */
export default async function ArtLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commits = await getActivity();
  return (
    <>
      <FieldTuning commits={commits} />
      <Backdrop accents={signatureAccents} />
      {/* Shadow-lift filter for the near-black UI screenshots. Gamma raises
          the shadows while leaving highlights alone; brightness() would just
          grey the whole image out. Applied via .lift. */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <filter id="field-lift" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="gamma" exponent="0.7" />
            <feFuncG type="gamma" exponent="0.7" />
            <feFuncB type="gamma" exponent="0.7" />
          </feComponentTransfer>
        </filter>
      </svg>
      {children}
    </>
  );
}
