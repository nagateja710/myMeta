"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardSection from "@/components/dashboard/DashboardSection";
import DashboardStats from "@/components/dashboard/DashboardStats";
import Card from "@/components/cards/card_mymeta";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

/* -----------------------------
   🔧 NORMALIZE BACKEND RESPONSE
-------------------------------- */
function normalizeItem(item) {
  // Case A: already normalized
  if (typeof item.media === "object" && item.media !== null) {
    return item;
  }

  // Case B: flat backend response
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

  // Case C: fallback
  return item;
}

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH FROM BACKEND
     ========================= */
  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadLibrary() {
      try {
        const data = await apiFetch("/user-media/");
        console.log("RAW USER MEDIA:", data);
        setItems(data.map(normalizeItem)); // 🔥 FIX
      } catch (err) {
        console.error("Failed to load library", err);
      } finally {
        setLoading(false);
      }
    }

    loadLibrary();
  }, [hasHydrated, user]);

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
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
      );
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
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-150 from-blue-400 via-purple-400 to-white flex items-center justify-center">
        <p className="text-white text-sm">Loading your library…</p>
      </div>
    );
  }

  /* =========================
     EMPTY DASHBOARD
     ========================= */
  if (!hasDashboardItems) {
    return (
      <div className="min-h-screen bg-linear-150 from-blue-400 via-purple-400 to-white">
        <div className="max-w-7xl mx-auto p-6">

          <header>
            <h1 className="text-2xl font-bold">MyMeta Dashboard</h1>
            <p className="text-sm text-white">
              Track everything you read, watch, and play
            </p>
          </header>

          <div className="mt-8">
            <DashboardStats items={items} />
          </div>

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

        <header>
          <h1 className="text-2xl font-bold">MyMeta Dashboard</h1>
          <p className="text-sm text-white">
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
