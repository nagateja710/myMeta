"use client";

import Card from "@/components/common/Card";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStats from "@/components/dashboard/DashboardStats";

import { tempBooks } from "@/data/tempbooks";
import { tempMovies } from "@/data/tempmovies";
import { tempGames } from "@/data/tempgames";
import { tempAnime } from "@/data/tempanime";

export default function Home() {
  // 🔗 merge all media
  const allItems = [
    ...tempBooks.map((i) => ({ ...i, type: "book", status: i.status || "todo" })),
    ...tempMovies.map((i) => ({ ...i, type: "movie", status: i.status || "completed", rating: i.rating || 4 })),
    ...tempGames.map((i) => ({ ...i, type: "game", status: i.status || "completed", rating: i.rating || 5 })),
    ...tempAnime.map((i) => ({ ...i, type: "anime", status: i.status || "reading" })),
  ];

  const continueItems = allItems.filter(
    (i) => i.status === "reading"
  );

  const completedItems = allItems.filter(
    (i) => i.status === "completed"
  );

  const topRatedItems = allItems.filter(
    (i) => i.rating === 5
  );

  const todoItems = allItems.filter(
    (i) => i.status === "todo"
  );

  return (
    <div className=" bg-linear-150 from-blue-400 via-purple-400 to-white
     ">
    <div className="max-w-7xl mx-auto p-6 space-y-10 ">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold">MyMeta Dashboard</h1>
        <p className="text-sm text-white">
          Track everything you read, watch, and play
        </p>
      </header>

      {/* STATS */}
      <DashboardStats items={allItems} />

      {/* CONTINUE */}
      <DashboardSection title="Continue">
        {continueItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} item={item} />
        ))}
      </DashboardSection>

      {/* RECENTLY COMPLETED */}
      <DashboardSection title="Recently Completed">
        {completedItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} item={item} />
        ))}
      </DashboardSection>

      {/* TOP RATED */}
      <DashboardSection title="Top Rated">
        {topRatedItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} item={item} />
        ))}
      </DashboardSection>

      {/* UP NEXT */}
      <DashboardSection title="Up Next">
        {todoItems.map((item) => (
          <Card key={`${item.type}-${item.id}`} item={item} />
        ))}
      </DashboardSection>
    </div>
     </div>
  );
}
