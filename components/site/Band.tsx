import FieldCanvas from '@/components/field/FieldCanvas';
import type { Signature } from '@/lib/field/signatures';

/** A thin strip of field between sections. Decorative. */
export default function Band({ accent, sig }: { accent?: string; sig?: Signature }) {
  return (
    <div className="band" aria-hidden="true">
      <FieldCanvas preset="band" accent={accent} sig={sig} />
    </div>
  );
}
