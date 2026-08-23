/**
 * Chrome-free wrapper for the art-directed presentation.
 *
 * Sets the neutral theme, which follows the system colour scheme. Project
 * pages nest their own `.art` element carrying a `data-theme` attribute to
 * override the palette and opt out of that following.
 */
export default function ArtLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="art">
      {/* Shadow-lift filter for the near-black UI screenshots. Gamma raises
          the shadows while leaving highlights alone — brightness() would just
          grey the whole image out. Applied via .art-lift. */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <filter id="art-lift" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="gamma" exponent="0.7" />
            <feFuncG type="gamma" exponent="0.7" />
            <feFuncB type="gamma" exponent="0.7" />
          </feComponentTransfer>
        </filter>
      </svg>
      {children}
    </div>
  );
}
