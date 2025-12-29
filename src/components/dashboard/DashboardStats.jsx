export default function DashboardStats({ items }) {
  const books = items.filter(
    (i) => i.media?.type === "book"
  ).length;

  const movies = items.filter(
    (i) => i.media?.type === "movie"
  ).length;

  const games = items.filter(
    (i) => i.media?.type === "game"
  ).length;

  const animes = items.filter(
    (i) => i.media?.type === "anime"
  ).length;

  const stats = [
    { label: "Books", value: books },
    { label: "Movies", value: movies },
    { label: "Games", value: games },
    { label: "Animes", value: animes },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white/30 rounded-lg border p-4 text-center"
        >
          <div className="text-2xl font-bold text-violet-300">{s.value}</div>
          <div className="text-sm text-gray-200">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
