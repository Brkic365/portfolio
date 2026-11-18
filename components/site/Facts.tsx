/** A ruled row of short label and value pairs. A third entry makes the value a link. */
export default function Facts({ items, cols = 4 }: { items: (readonly [string, string] | readonly [string, string, string])[]; cols?: number }) {
  return (
    <dl className="facts-row" style={{ '--cols': cols } as React.CSSProperties}>
      {items.map(([k, v, href]) => (
        <div key={k}>
          <dt className="small">{k}</dt>
          <dd>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {v}
              </a>
            ) : (
              v
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
