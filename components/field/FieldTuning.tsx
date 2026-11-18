'use client';

import { useEffect } from 'react';
import { tune } from '@/lib/field/engine';

/**
 * Hands the build-time activity count to the field engine. Renders nothing.
 * Fields read the tuning when they first build, which is always after this
 * effect has run.
 */
export default function FieldTuning({ commits }: { commits: number | null }) {
  useEffect(() => {
    tune(commits);
  }, [commits]);
  return null;
}
