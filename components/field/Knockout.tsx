'use client';

import { createElement, useRef, type ReactNode } from 'react';
import { useField, type FieldProps } from '@/lib/field/useField';

interface KnockoutProps extends FieldProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'a' | 'span';
  id?: string;
  href?: string;
  className?: string;
  wrapClassName?: string;
  children: ReactNode;
}

/**
 * A heading the field shows through. The text is a real element, laid out by
 * CSS, selectable and read by screen readers; the canvas behind it traces that
 * layout word by word. Without JavaScript, or until the field has drawn, the
 * text is simply solid.
 */
export default function Knockout({
  as = 'h2',
  id,
  href,
  className = '',
  wrapClassName = '',
  children,
  minSize = 30,
  ...field
}: KnockoutProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLElement>(null);
  useField(canvas, text, { minSize, ...field });
  return (
    <div className={`ko-wrap ${wrapClassName}`}>
      <canvas ref={canvas} aria-hidden="true" />
      {createElement(as, { ref: text, id, href, className: `ko ${className}` }, children)}
    </div>
  );
}
