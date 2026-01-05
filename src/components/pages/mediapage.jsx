"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Card from "@/components/cards/card_mymeta";
import AdvancedAddInline from "@/components/cards/AdvancedAddInline";
import { useLibraryStore } from "@/store/useLibraryStore";

/* -----------------------------
   🎨 BACKGROUND CONFIGS
-------------------------------- */
const BACKGROUND_STYLES = {
  anime: {
    bgClass: "bg-gradient-to-br from-amber-950 via-yellow-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(251,191,36,0.03) 2deg, transparent 4deg)",
          }}
        />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  movie: {
    bgClass: "bg-gradient-to-br from-purple-950 via-fuchsia-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px),
              linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

series: {
  bgClass: "bg-gradient-to-br from-indigo-950 via-violet-950 to-zinc-950",
  pattern: (
    <>
      {/* Horizontal episode stripes */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 28px,
              rgba(99,102,241,0.05) 28px,
              rgba(99,102,241,0.05) 29px
            )
          `,
        }}
      />

      {/* Soft timeline glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
    </>
  ),
},


  game: {
    bgClass: "bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(148,163,184,0.03) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(148,163,184,0.03) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(148,163,184,0.03) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(148,163,184,0.03) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
      </>
    ),
  },

  book: {
    bgClass: "bg-gradient-to-br from-blue-950 via-cyan-950 to-zinc-950",
    pattern: (
      <>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(59,130,246,0.03) 35px, rgba(59,130,246,0.03) 36px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(59,130,246,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </>
    ),
  },
};

/* ===================================================== */

export default function MediaPage({ type }) {
  const items = useLibraryStore((s) => s.items);
  const hydrated = useLibraryStore((s) => s.hydrated);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);

  const [editingItem, setEditingItem] = useState(null);
  const pathname = usePathname();

  const bg = BACKGROUND_STYLES[type] || BACKGROUND_STYLES.book;

  const filteredItems = useMemo(
    () => items.filter((i) => i.media?.type === type),
    [items, type]
  );
  const doingItems = useMemo(
  () => filteredItems.filter((i) => i.status === "doing"),
  [filteredItems]
);

const restItems = useMemo(
  () => filteredItems.filter((i) => i.status !== "doing"),
  [filteredItems]
);


  if (!hydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gray-400">
        Loading your {type}...
      </div>
    );
  }

  return (
    
    <div className={`min-h-screen relative overflow-hidden ${bg.bgClass}`}>
      <div className="absolute inset-0">{bg.pattern}</div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="p-6">
          <h1 className="text-2xl font-bold uppercase text-white">
            {type}
          </h1>
          <p className="text-sm text-gray-300">
            Track what you’re into
          </p>
        </div>

        {/* EMPTY */}
        {filteredItems.length === 0 && (
          <p className="px-6 text-sm text-gray-400">
            Nothing here yet. Add something ✨
          </p>
        )}

{/* DOING ROW (HORIZONTAL SCROLL) */}
{doingItems.length > 0 && (
  <div className="px-6 pb-2">
    <h2 className="text-sm font-semibold text-gray-200 mb-2">
      In Progress
    </h2>

    <div
      className="
        flex gap-20
        md:gap-8
        overflow-x-auto
        p-4
        rounded-lg
        scrollbar-hide
        snap-x snap-mandatory
        bg-white/40
      "
    >
      {doingItems.map((item) => (
        <div key={item.id} className="snap-start shrink-0 w-[150px] md:w-[180px]">
          <Card
            item={item}
            onEdit={() => setEditingItem(item)}
            onUpdated={(u) => updateItem(item.id, u)}
            onDeleted={(id) => removeItem(id)}
          />
        </div>
      ))}
    </div>
  </div>
)}

        {/* GRID */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 p-6">
          {restItems.map((item) => (
            <Card
              key={item.id}
              item={item}
              onEdit={() => setEditingItem(item)}
              onUpdated={(u) => updateItem(item.id, u)}
              onDeleted={(id) => removeItem(id)}
            />
          ))}
        </div>

        {/* EDIT MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3">
            <div className="w-full max-w-[520px]">
              <AdvancedAddInline
                item={editingItem}
                mode="edit"
                onCancel={() => setEditingItem(null)}
                onSaved={(updates, deletedId) => {
                  if (deletedId) {
                    removeItem(deletedId);
                    setEditingItem(null);
                    return;
                  }
                  if (updates) updateItem(editingItem.id, updates);
                  setEditingItem(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
