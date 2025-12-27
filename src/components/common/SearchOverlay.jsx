"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";
import AdvancedAddInline from "./AdvancedAddInline";

export default function SearchOverlay({ loading, results }) {
  const pathname = usePathname();
  const section = pathname.split("/")[1];

  const addItem = useLibraryStore((s) => s.addItem);
  const [advancedItem, setAdvancedItem] = useState(null);

  function quickAdd(item) {
    addItem({
      id: crypto.randomUUID(),
      cover: item.cover,
      title: item.title,
      subtitle: item.subtitle,
      year: item.year,
      addedAt: new Date().toISOString().slice(0, 10),
      type: section,
      status: "todo",
      rating: 0,
    });
  }

  // 🔥 ADVANCED ADD VIEW
  if (advancedItem) {
    return (
      <AdvancedAddInline
        item={advancedItem}
        mode="add"
        onCancel={() => setAdvancedItem(null)}
      />
    );
  }

  // 🔍 SEARCH RESULTS
  return (
    <div className="mt-2 w-full rounded-lg border bg-white shadow-xl max-h-[60vh] overflow-y-auto">
      <ul className="divide-y">
        {results.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className="flex items-start gap-3 p-3 hover:bg-slate-100"
          >
            <Image
              src={item.cover}
              alt={item.title}
              width={40}
              height={60}
              className="rounded object-cover shrink-0"
            />

            <div className="flex flex-col flex-1 text-sm">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-600">{item.subtitle}</p>
              {item.year && (
                <p className="text-xs text-gray-500">{item.year}</p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 self-center shrink-0">
              {/* QUICK ADD */}
              <button
                onClick={() => quickAdd(item)}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-yellow-400 text-yellow-500"
                title="Quick Add"
              >
                ⚡
              </button>

              {/* ADVANCED ADD */}
              <button
                onClick={() =>
                  setAdvancedItem({
                    ...item,
                    type: section,
                  })
                }
                className="w-7 h-7 flex items-center justify-center rounded-full border border-yellow-500 text-yellow-500 text-lg"
                title="Advanced Add"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
