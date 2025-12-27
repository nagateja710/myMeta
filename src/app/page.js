"use client";

import { useMemo } from "react";

import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStats from "@/components/dashboard/DashboardStats";

import { useLibraryStore } from "@/store/useLibraryStore";
import Card from "@/components/common/card_mymeta";

export default function Home() {
  // 📦 global store
  const items = useLibraryStore((s) => s.items);

  // 🧠 derived views
  const continueItems = useMemo(
    () => items.filter((i) => i.status === "reading" || i.status==="ongoing"),
    [items]
  );

  const completedItems = useMemo(
    () => items.filter((i) => i.status === "completed"),
    [items]
  );

  const topRatedItems = useMemo(
    () => items.filter((i) => i.rating === 5),
    [items]
  );

  const todoItems = useMemo(
    () => items.filter((i) => i.status === "todo"),
    [items]
  );

  /* =========================
     EMPTY DASHBOARD STATE
     ========================= */
  if (items.length ===0) {
    return (
      <div className="min-h-screen bg-linear-150 from-blue-400 via-purple-400 to-white">
        <div className="max-w-7xl mx-auto p-6">

          {/* HEADER */}
          <header>
            <h1 className="text-2xl font-bold">MyMeta Dashboard</h1>
            <p className="text-sm text-white">
              Track everything you read, watch, and play
            </p>
          </header>

          {/* STATS (optional, but looks good) */}
          <div className="mt-8">
            <DashboardStats items={items} />
          </div>

          {/* EMPTY STATE */}
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center text-white">
            <h2 className="text-2xl font-semibold mb-2">
              Your library is empty
            </h2>
            <p className="text-sm max-w-md text-white/90">
              Start by searching for a book, movie, anime, or game using the search bar above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     NORMAL DASHBOARD
     ========================= */
  return (
    <div className="min-h-screen bg-linear-150 from-blue-400 via-purple-400 to-white">
      <div className="max-w-7xl mx-auto p-6 space-y-10">

        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold">MyMeta Dashboard</h1>
          <p className="text-sm text-white">
            Track everything you read, watch, and play
          </p>
        </header>

        {/* STATS */}
        <DashboardStats items={items} />

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
