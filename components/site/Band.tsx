/**
 * A breathing gap between sections. It used to hold a strip of its own field;
 * now the background field shows through it, so it is just space.
 */
export default function Band() {
  return <div className="band" aria-hidden="true" />;
}
