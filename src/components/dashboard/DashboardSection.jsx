export default function DashboardSection({ title, children }) {
  if (!children || children.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {children}
      </div>
    </section>
  );
}
