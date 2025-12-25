"use client";

import { useMemo } from "react";

import Card from "@/components/common/card_mymeta";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStats from "@/components/dashboard/DashboardStats";

import { useLibraryStore } from "@/store/useLibraryStore";

export default function Home() {
  // 📦 get all items from global store
  const items = useLibraryStore((s) => s.items);

  // 🧠 derived dashboard views (memoized)
  const continueItems = useMemo(
    () => items.filter((i) => i.status === "reading"),
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

  return (
    <div className="bg-linear-150 from-blue-400 via-purple-400 to-white">
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
