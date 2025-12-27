"use client";

import { useMemo, useState } from "react";
import Card from "@/components/common/card_mymeta";
import AdvancedAddInline from "@/components/common/AdvancedAddInline";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function AnimePage() {
  const items = useLibraryStore((s) => s.items);
  const [editingItem, setEditingItem] = useState(null);
  const type="games"
  const animeItems = useMemo(
    () => items.filter((i) => i.type === type),
    [items]
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-400 to-white">
           {/* GRID */}
           <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 p-6">
             {animeItems.map((item) => (
               <Card
                 key={item.id}
                 item={item}
                 onEdit={() => setEditingItem(item)}
               />
             ))}
           </div>
     
           {/* 🔥 MOBILE + DESKTOP EDIT OVERLAY */}
           {editingItem && (
             <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
               <div className="w-full max-w-[520px]">
                 <AdvancedAddInline
                   item={editingItem}
                   mode="edit"
                   onCancel={() => setEditingItem(null)}
                 />
               </div>
             </div>
           )}
    </div>
  );
}
