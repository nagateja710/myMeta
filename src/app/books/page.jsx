"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/cards/card_mymeta";
import AdvancedAddInline from "@/components/cards/AdvancedAddInline";
import { apiFetch } from "@/lib/api";

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

export default function AnimePage() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const type = "book"; // ✅ correct type for this page

  /* -----------------------------
     🔄 LOAD USER MEDIA
  -------------------------------- */
  useEffect(() => {
    apiFetch("/user-media/")
      .then((data) => {
        console.log("RAW USER MEDIA:", data); // debug once
        setItems(data.map(normalizeItem));
      })
      .catch((err) => {
        console.error("Failed to load user media", err);
      })
      .finally(() => setLoading(false));
  }, []);

  /* -----------------------------
     🎯 FILTER BY MEDIA TYPE
  -------------------------------- */
  const filteredItems = useMemo(
    () => items.filter((i) => i.media?.type === type),
    [items, type]
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-400 to-white">
      {/* ⏳ LOADING */}
      {loading && (
        <p className="p-6 text-sm text-gray-600">Loading…</p>
      )}

      {/* 💤 EMPTY STATE */}
      {!loading && filteredItems.length === 0 && (
        <p className="p-6 text-sm text-gray-600">
          Nothing here yet. Add something ✨
        </p>
      )}

      {/* 🧩 GRID */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 p-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            item={item}
            onEdit={() => setEditingItem(item)}
            onUpdated={(updated) =>
              setItems((prev) =>
                prev.map((i) =>
                  i.id === updated.id ? normalizeItem(updated) : i
                )
              )
            }
            onDeleted={(id) =>
              setItems((prev) => prev.filter((i) => i.id !== id))
            }
          />
        ))}
      </div>

      {/* ✏️ EDIT OVERLAY */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-[520px]">
            <AdvancedAddInline
              item={editingItem}
              mode="edit"
              onCancel={() => setEditingItem(null)}
              onSaved={(updated) => {
                setItems((prev) =>
                  prev.map((i) =>
                    i.id === updated.id ? normalizeItem(updated) : i
                  )
                );
                setEditingItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
