import type { ReactNode } from 'react';
import Knockout from '@/components/field/Knockout';

/**
 * A section heading. Big ones are knockouts; mid-sized ones are solid type,
 * so a page does not turn into a wall of fields.
 */
export default function SectionHead({
  id,
  title,
  note,
  accent,
  size = 'big',
  knockout = size === 'big',
}: {
  id: string;
  title: ReactNode;
  note?: ReactNode;
  accent?: string;
  size?: 'big' | 'mid';
  /** Big headings are knockouts by default, mid ones solid. */
  knockout?: boolean;
}) {
  return (
    <div className="sec-h">
      {knockout ? (
        <Knockout as="h2" id={id} className={size === 'mid' ? 'disp mid' : 'disp'} accent={accent}>
          {title}
        </Knockout>
      ) : (
        <h2 id={id} className="disp mid">
          {title}
        </h2>
      )}
      {note && <p>{note}</p>}
    </div>
  );
}
