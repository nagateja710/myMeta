import { RotatingText } from "@/components/ui/shadcn-io/rotating-text/index";
import { complex } from "motion";

export default function DashboardStats({ items }) {
  const currentYear = new Date().getFullYear();

  // Filter items for current year
  const itemsThisYear = items.filter((item) => {
    // if (!item.createdAt && !item.watchedAt && !item.updatedat) return false;
    const itemDate = new Date(item.updatedAt || item.updated_at);
    return itemDate.getFullYear() === currentYear;
  });

  // Lifetime stats
  const lifetimeBooks = items.filter((i) => i.media?.type === "book").length;
  const lifetimeMovies = items.filter((i) => i.media?.type === "movie").length;
  const lifetimeGames = items.filter((i) => i.media?.type === "game").length;
  const lifetimeAnimes = items.filter((i) => i.media?.type === "anime").length;
  const lifetimeSeries = items.filter((i) => i.media?.type === "series").length;
  const lifetime = items.length;


  const lifetimeBooks_completed = items.filter((i) => i.media?.type === "book" && i.status==="completed").length;
  const lifetimeMovies_completed = items.filter((i) => i.media?.type === "movie" && i.status==="completed").length;
  const lifetimeGames_completed = items.filter((i) => i.media?.type === "game" && i.status==="completed").length;
  const lifetimeAnimes_completed = items.filter((i) => i.media?.type === "anime" && i.status==="completed").length;
  const lifetimeSeries_completed = items.filter((i) => i.media?.type === "series" && i.status==="completed").length;
  const lifetime_completed = items.filter((i) =>  i.status==="completed").length;
  // This year stats
  const yearBooks = itemsThisYear.filter((i) => i.media?.type === "book"  && i.status==="completed").length;
  const yearMovies = itemsThisYear.filter((i) => i.media?.type === "movie"  && i.status==="completed").length;
  const yearGames = itemsThisYear.filter((i) => i.media?.type === "game"  && i.status==="completed").length;
  const yearAnimes = itemsThisYear.filter((i) => i.media?.type === "anime"  && i.status==="completed").length;
  const yearSeries = itemsThisYear.filter((i) => i.media?.type === "series"  && i.status==="completed").length;
  const year = itemsThisYear.filter((i)=> i.status==="completed").length;

  const stats = [
    // { label: "TOTAL", lifetime: lifetime, year: year ,completed:lifetime_completed},
    { label: "Books", lifetime: lifetimeBooks, year: yearBooks,completed:lifetimeBooks_completed },
    { label: "Movies", lifetime: lifetimeMovies, year: yearMovies ,completed:lifetimeMovies_completed},
    { label: "Series", lifetime: lifetimeSeries, year: yearSeries,completed:lifetimeSeries_completed },
    { label: "Games", lifetime: lifetimeGames, year: yearGames,completed:lifetimeGames_completed },
    { label: "Animes", lifetime: lifetimeAnimes, year: yearAnimes ,completed:lifetimeAnimes_completed},
    
  ];

  return (
    <div className="space-y-4">
      <div className="text-center text-lg text-gray-200">
        {/* Stats for{" "} */}
        {/* <p>Stats</p> */}
        <RotatingText
        
          text={["LIFETIME","LIFETIME COMPLETED", "THIS YEAR COMPLETED"]}
          duration={4000}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block text-violet-300 font-semibold"
        />
      </div>


      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <div  className="bg-white/30 rounded-lg border p-2 text-center">
        <div className="text-3xl font-bold text-rose-400">
                         <RotatingText
                text={[lifetime,lifetime_completed, year]}
                duration={4000}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                y={-20}
              />
        </div>
         <div className="text-sm text-gray-200">TOTAL</div>
        </div>

        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white/30 rounded-lg border p-2 text-center"
          >
            <div className="text-2xl font-bold text-violet-300">
              <RotatingText
                text={[s.lifetime.toString(),s.completed.toString(), s.year.toString()]}
                duration={4000}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                y={-20}
              />
            </div>
            <div className="text-sm text-gray-200">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
