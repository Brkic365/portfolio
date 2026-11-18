'use client';

import { useRef } from 'react';
import { useField, type FieldProps } from '@/lib/field/useField';

interface FieldCanvasProps extends FieldProps {
  className?: string;
  /** id of an element whose text the field traces as a knockout, e.g. the hero name. */
  trace?: string;
}

/**
 * A field on its own canvas, such as the hero behind its traced name. Purely
 * decorative, so it is hidden from assistive technology; any text it traces
 * is a real element elsewhere in the page.
 */
export default function FieldCanvas({ className, trace, ...field }: FieldCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useField(canvas, trace ? () => document.getElementById(trace) : null, field);
  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
