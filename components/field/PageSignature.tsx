'use client';

import { useEffect } from 'react';
import { setRestingSignature } from '@/lib/field/backdrop';
import { HOT, type Signature } from '@/lib/field/signatures';

/**
 * Sets the background field's signature and accent for as long as this page
 * is mounted, and hands it back to the site's curl and orange afterwards.
 * Renders nothing.
 */
export default function PageSignature({ sig, accent }: { sig: Signature; accent: string }) {
  useEffect(() => {
    setRestingSignature(sig, accent);
    return () => setRestingSignature('curl', HOT);
  }, [sig, accent]);
  return null;
}
