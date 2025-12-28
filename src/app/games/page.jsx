"use client";

import { useMemo, useState } from "react";
import Card from "@/components/cards/card_mymeta";
import AdvancedAddInline from "@/components/cards/AdvancedAddInline";
import { useLibraryStore } from "@/store/useLibraryStore";

/* -----------------------------
   🎨 PAGE COLORS
-------------------------------- */
const page_col={
 
  anime: "yellow",
  movie: "from-purple-400 to-white",
  game: "from-gray-400 to-white",
  book: "blue",
};

export default function AnimePage() {
  const items = useLibraryStore((s) => s.items);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);

  const [editingItem, setEditingItem] = useState(null);

  const type = "game";

  /* -----------------------------
     🎯 FILTER USER ANIME
  -------------------------------- */
  const animeItems = useMemo(
    () => items.filter((i) => i.media?.type === type),
    [items]
  );

  /* -----------------------------
     ⏳ WAIT FOR HYDRATION
  -------------------------------- */
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your {type}…
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-linear-to-b ${page_col[type]}`}
    >
      {/* HEADER */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Games</h1>
        <p className="text-sm text-gray-700">
          Track what you’re Playing
        </p>
      </div>

      {/* EMPTY STATE */}
      {animeItems.length === 0 && (
        <p className="px-6 text-sm text-gray-600">
          Nothing here yet. Add something ✨
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 p-6">
        {animeItems.map((item) => (
          <Card
            key={item.id}
            item={item}
            onEdit={() => setEditingItem(item)}
            onUpdated={(updates) =>
              updateItem(item.id, updates)
            }
            onDeleted={(id) => removeItem(id)}
          />
        ))}
      </div>

      {/* EDIT OVERLAY */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-[520px]">
           <AdvancedAddInline
                         item={editingItem}
                         mode="edit"
                         onCancel={() => setEditingItem(null)}
                         onSaved={(updates, deletedId) => {
                           // 🔥 DELETE case
                           if (deletedId) {
                             removeItem(deletedId);
                             setEditingItem(null);
                             return;
                           }
           
                           // ✅ UPDATE case
                           if (updates) {
                             updateItem(editingItem.id, updates);
                           }
           
                           setEditingItem(null);
                         }}
                       />
          </div>
        </div>
      )}
    </div>
  );
}
