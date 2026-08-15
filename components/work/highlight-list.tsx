/**
 * The bulleted body used by both a role and an engagement. One definition so
 * the two never drift apart.
 */
export function HighlightList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <span
            aria-hidden
            className="mt-2 size-1 shrink-0 rounded-full bg-brand"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
