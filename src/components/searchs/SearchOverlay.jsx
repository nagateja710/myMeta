"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdvancedAddInline from "../cards/AdvancedAddInline";
import { apiFetch } from "@/lib/api";
import { useLibraryStore } from "@/store/useLibraryStore";

function safeYear(year) {
  const y = Number(year);
  return Number.isInteger(y) && y > 0 ? y : 2069;
}

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

export default function SearchOverlay({ loading, results }) {
  const pathname = usePathname();
  const section= pathname === "/anime" ? pathname.slice(1) : pathname.slice(1, -1);
  const addItem = useLibraryStore((s) => s.addItem);

  const [advancedItem, setAdvancedItem] = useState(null);
  const [addingId, setAddingId] = useState(null);

  /* =========================
     ⚡ QUICK ADD
     ========================= */
    // console.log(section,section==='anime');
  async function quickAdd(item) {
    try {
      setAddingId(item.id);

      const created = await apiFetch("/add-to-library/", {
        method: "POST",
        body: JSON.stringify({
          type: section,
          
          title: item.title,
          synopsis: item.subtitle,
          release_year: safeYear(item.year),
          cover_url: item.cover,
        }),
      });

      // 🔥 PUSH INTO GLOBAL STORE
      addItem(normalizeItem(created));
    } catch (err) {
      console.warn("Already in library or failed:", err.message);
    } finally {
      setAddingId(null);
    }
  }

  /* =========================
     🔥 ADVANCED ADD VIEW
     ========================= */
  if (advancedItem) {
    return (
      <div className="p-2">
        <AdvancedAddInline
          item={{
            title: advancedItem.title,
            cover_url: advancedItem.cover,
            synopsis: advancedItem.subtitle,
            release_year: safeYear(advancedItem.year),
            type: section,
          }}
          mode="add"
          onCancel={() => setAdvancedItem(null)}
          onSaved={(created) => {
            // 🔥 PUSH INTO GLOBAL STORE
            addItem(normalizeItem(created));
            setAdvancedItem(null);
          }}
        />
      </div>
    );
  }

  /* =========================
     🔍 SEARCH RESULTS
     ========================= */
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
              {/* ⚡ QUICK ADD */}
              <button
                onClick={() => quickAdd(item)}
                disabled={addingId === item.id}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-yellow-400 text-yellow-500 disabled:opacity-40"
                title="Quick Add"
              >
                ⚡
              </button>

              {/* ➕ ADVANCED ADD */}
              <button
                onClick={() => setAdvancedItem(item)}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-yellow-500 text-yellow-500 text-lg"
                title="Advanced Add"
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && results.length === 0 && (
        <p className="px-4 py-3 text-sm text-gray-500">No results</p>
      )}
    </div>
  );
}
