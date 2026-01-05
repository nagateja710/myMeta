"use client";

import { useMemo } from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStats from "@/components/dashboard/DashboardStats";
import Card from "@/components/cards/card_mymeta";
import { useLibraryStore } from "@/store/useLibraryStore";

/* -----------------------------
   🔧 NORMALIZE BACKEND RESPONSE
-------------------------------- */
function normalizeItem(item) {
  if (typeof item.media === "object" && item.media !== null) {
    return item;
  }

  if (item.media_type) {
    return {
      ...item,
      media: {
        type: item.media_type,
        title: item.title,
        cover_url: item.cover_url,
        synopsis: item.synopsis,
        release_year: item.release_year,
      },
    };
  }

  return item;
}

export default function Home() {
  // 🔥 USE LIBRARY STORE INSTEAD OF FETCHING
  const items = useLibraryStore((s) => s.items || []);
  const hydrated = useLibraryStore((s) => s.hydrated);

  /* =========================
     DERIVED VIEWS
     ========================= */
  const continueItems = useMemo(
    () => items.filter((i) => i.status === "doing"),
    [items]
  );

  const completedItems = useMemo(() => {
    return items
      .filter((i) => i.status === "completed")
      .sort((a, b) => {
        const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return tb - ta;
      });
  }, [items]);

  const topRatedItems = useMemo(
    () => items.filter((i) => i.rating === 5),
    [items]
  );

  const todoItems = useMemo(
    () => items.filter((i) => i.status === "todo"),
    [items]
  );

  const hasDashboardItems =
    continueItems.length ||
    completedItems.length ||
    topRatedItems.length ||
    todoItems.length;

  /* =========================
     LOADING STATE
     ========================= */
  if (!hydrated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>
        
        <p className="text-gray-300 text-sm relative z-10">Loading your library…</p>
      </div>
    );
  }

  /* =========================
     EMPTY DASHBOARD
     ========================= */
  if (!hasDashboardItems) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto p-6 relative z-10">
          <header>
            <h1 className="text-2xl font-bold text-white">MyMeta Dashboard</h1>
            <p className="text-sm text-gray-300">
              Track everything you read, watch, and play
            </p>
          </header>

          <div className="mt-8">
            <DashboardStats items={items} />
          </div>

          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold mb-2 text-white">
              Your library is empty
            </h2>
            <p className="text-sm max-w-md text-gray-300">
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-10 relative z-10">
        <header>
          <h1 className="text-2xl font-bold text-white">MyMeta Dashboard</h1>
          <p className="text-sm text-gray-300">
            Track everything you read, watch, and play
          </p>
        </header>

        <DashboardStats items={items} />

        <DashboardSection title="Continue">
          {continueItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </DashboardSection>

        <DashboardSection title="Recently Completed">
          {completedItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </DashboardSection>

        <DashboardSection title="Top Rated">
          {topRatedItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </DashboardSection>

        <DashboardSection title="Up Next">
          {todoItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </DashboardSection>
      </div>
    </div>
  );
}
