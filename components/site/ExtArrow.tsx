/**
 * The off-site arrow, drawn as a stroke. The ↗ character it replaces is
 * shown as a colour emoji on Windows and iOS, which looked out of place.
 */
export default function ExtArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `ext-arrow ${className}` : 'ext-arrow'}
      viewBox="0 0 10 10"
      width="0.7em"
      height="0.7em"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
    </svg>
  );
}
