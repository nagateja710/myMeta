export default function DashboardStats({ items }) {
  const stats = {
    book: items.filter((i) => i.type === "books").length,
    movie: items.filter((i) => i.type === "movies").length,
    game: items.filter((i) => i.type === "games").length,
    anime: items.filter((i) => i.type === "anime").length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Books" count={stats.book} />
      <StatCard label="Movies" count={stats.movie} />
      <StatCard label="Games" count={stats.game} />
      <StatCard label="Animes" count={stats.anime} />
    </div>
  );
}

function StatCard({ label, count }) {
  return (
    <div className="rounded-lg border bg-white p-4 text-center">
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
