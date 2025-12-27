"use client";

import { useMemo, useState } from "react";
import Card from "@/components/common/card_mymeta";
import AdvancedAddInline from "@/components/common/AdvancedAddInline";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function AnimePage() {
  const items = useLibraryStore((s) => s.items);
  const [editingId, setEditingId] = useState(null);
  const type="books"
  const animeItems = useMemo(
    () => items.filter((i) => i.type === type),
    [items]
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-400 to-white">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 p-6">
        {animeItems.map((item) => {
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className={`
        relative
        ${isEditing ? "z-30 col-span-1 sm:col-span-2" : "z-0"}
      `}
            >
              {isEditing ? (
                <AdvancedAddInline
                  item={item}
                  type="type"
                  mode="edit"
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <Card item={item} onEdit={() => setEditingId(item.id)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
