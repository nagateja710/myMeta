export default function DashboardSection({ title, children }) {
  if (!children || children.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* SECTION TITLE */}
      <h2 className="text-lg font-semibold">{title}</h2>

      {/* HORIZONTAL CAROUSEL */}
      <div
        className="
          flex gap-6
          overflow-x-auto
          pb-4
          scrollbar-hide
          snap-x snap-mandatory
        "
      >
        {children.map((child, idx) => (
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
