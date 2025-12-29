export default function DashboardSection({ title, children }) {
  // Normalize children (React can pass single child or array)
  const items = Array.isArray(children)
    ? children
    : children
    ? [children]
    : [];

  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-violet-100">{title}</h2>

      <div
        className="
          flex gap-6
          overflow-x-auto
          pb-4
          scrollbar-hide
          snap-x snap-mandatory
        "
      >
        {items.map((child, idx) => (
          <div
            key={idx}
            className="snap-start shrink-0"
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
