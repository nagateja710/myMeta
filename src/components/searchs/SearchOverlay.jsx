"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AdvancedAddInline from "../cards/AdvancedAddInline";
import { addToLibrary } from "@/actions/libraryactions";

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

  const pathSection = pathname.split("/")[2];

  const section =
    pathSection === "anime" || pathSection === "series"
      ? pathSection
      : pathSection.slice(0, -1);

  const addItem = useLibraryStore((s) => s.addItem);

  const [advancedItem, setAdvancedItem] = useState(null);
  const [addingId, setAddingId] = useState(null);

  /* =========================
     ⚡ QUICK ADD
     ========================= */
  async function quickAdd(item) {
    try {
      setAddingId(item.id);

      const created = await addToLibrary({
        type: section,
        title: item.title,
        synopsis: item.subtitle,
        release_year: safeYear(item.year),
        cover_url: item.cover,
      });

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
const [firstItem, ...searchResults] = results;

return (
  <div className="mt-2 w-full rounded-lg border bg-white shadow-xl max-h-[60vh] overflow-y-auto">
    {/* ➕ CUSTOM / FIRST ITEM */}
    {firstItem && (
      <div className="p-3 bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100 transition">
        <div className="flex items-center gap-3">
          <div className="w-7 h-10 shrink-0 rounded flex items-center justify-center bg-purple-500 text-white text-2xl font-light">
            +
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <p className="font-medium text-gray-700 truncate">
              {firstItem.title}
            </p>

            <p className="text-sm text-gray-600">
              {` Add to ${firstItem.subtitle}`}
            </p>
          </div>
              <button
                onClick={() => setAdvancedItem(firstItem)}
                className="w-7 h-7 flex items-center justify-center rounded-full border  text-white bg-purple-500 text-lg"
                title="Advanced Add"
              >
                +
              </button>
          {/* <button
            onClick={() => setAdvancedItem(firstItem)}
            className="px-3 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition"
          >
            Add
          </button> */}
        </div>
      </div>
    )}

    {/* 🔍 NORMAL SEARCH RESULTS */}
    {searchResults.length > 0 && (
      <ul className="divide-y">
        {searchResults.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className="flex items-start gap-3 p-3 hover:bg-slate-100"
          >
            <Image
              src={item.cover}
              alt={item.title}
              width={40}
              height={60}
              className="rounded object-cover shrink-0 aspect-[2/3]"
              unoptimized
            />

            <div className="flex flex-col flex-1 text-sm">
              <p className="font-medium">{item.title}</p>
              <p className="text-gray-600">{item.subtitle}</p>

              {item.year && (
                <p className="text-xs text-gray-500">
                  {item.year}
                </p>
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
    )}

    {!loading && results.length === 0 && (
      <p className="px-4 py-3 text-sm text-gray-500">
        No results
      </p>
    )}
  </div>
);
}