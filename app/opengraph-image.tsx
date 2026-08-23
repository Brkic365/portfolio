import { ImageResponse } from 'next/og';

export const alt = 'Antonio Brkić, full-stack developer in Zagreb';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Fetches the display face Satori needs to render the wordmark in the same
 * type as the site. Returns null if anything goes wrong, in which case the
 * card falls back to the default sans rather than failing the build.
 */
async function displayFont(): Promise<ArrayBuffer | null> {
  try {
    // No User-Agent override on purpose. Legacy UA strings make Google serve
    // EOT, which Satori rejects; the default gets a plain TTF.
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap',
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;

    const data = await fetch(url).then((r) => r.arrayBuffer());

    // Guard the format: TTF starts 0x00010000, OTF is 'OTTO'. Anything else
    // throws inside Satori, which would fail the build instead of degrading.
    const sig = new DataView(data).getUint32(0);
    if (sig !== 0x00010000 && sig !== 0x4f54544f) return null;

    return data;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await displayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f4f2ee',
          color: '#14130f',
          padding: '72px 80px',
          fontFamily: font ? 'Instrument Serif' : undefined,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#6f6a5e',
          }}
        >
          <span>Full-stack developer</span>
          <span>Zagreb, HR</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 168, lineHeight: 0.95, letterSpacing: -4 }}>Antonio</div>
          <div style={{ fontSize: 168, lineHeight: 0.95, letterSpacing: -4 }}>Brkić</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '2px solid #14130f',
            paddingTop: 28,
            fontSize: 30,
            color: '#5c584f',
          }}
        >
          <span>Web apps that keep up with live data</span>
          <span style={{ fontSize: 22, letterSpacing: 2, color: '#6f6a5e' }}>
            antoniobrkic.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: 'Instrument Serif', data: font, style: 'normal', weight: 400 }]
        : undefined,
    },
  );
}
