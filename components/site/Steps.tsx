/** Numbered steps, the number set huge in the project's accent. */
export default function Steps({ items }: { items: [string, string][] }) {
  return (
    <ol className="steps">
      {items.map(([title, body], i) => (
        <li className="step" key={title}>
          <span className="n disp" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{title}</h3>
          <p>{body}</p>
        </li>
      ))}
    </ol>
  );
}
