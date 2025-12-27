"use client";

import Image from "next/image";
import { useState } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";
import { usePathname } from "next/navigation";

const STATUS_LABELS = {
  todo: "To Do",
  reading: "In Progress",
};

const STATUS_COLORS = {
  todo: "bg-gray-200/60 text-gray-700 backdrop-blur",
  reading: "bg-blue-200/60 text-blue-700 backdrop-blur",
};

const TYPE_COLORS = {
  anime: "bg-yellow-500/80 text-white",
  movies: "bg-purple-500/70 text-white",
  games: "bg-gray-500/70 text-white",
  books: "bg-blue-500/70 text-white",
};

export default function Card({ item, onEdit }) {
  const { updateItem, removeItem } = useLibraryStore();
  const pathname = usePathname();

  // persistent data
  const status = item.status || "todo";
  const rating = item.rating || 0;
  const type = item.type || "mx";
  const addeddate = item.ratedAt || "2025";

  // UI state
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  return (
    <div
      className="
        group
        w-50
        h-75
        rounded-lg
        border
        bg-white
        p-4
        flex
        flex-col
        items-center
        text-center
        relative
      "
    >
      {/* ✏️ EDIT BUTTON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(item);
        }}
        className="
          absolute bottom-2 left-2
          hidden group-hover:flex
          items-center justify-center
          w-7 h-7
          rounded-full
         text-sm border border-amber-600
          z-30
        "
        title="Edit"
      >
        ✏️
      </button>

      {/* TYPE BADGE (home page only) */}
      {pathname === "/" && (
        <div
          className={`absolute top-2 left-2 z-20 text-[10px] px-1 py-1 font-medium uppercase rounded-lg backdrop-blur ${
            TYPE_COLORS[type] || "bg-gray-400 text-white"
          }`}
        >
          {type.at(-1) === "s" ? type.slice(0, -1) : type}
        </div>
      )}

      {/* COMPLETED DATE */}
      {status === "completed" && (
        <div className="absolute bottom-2 right-2 z-10 text-[9px] text-gray-400">
          {item.ratedAt}
        </div>
      )}

      {/* STATUS / RATING */}
      <div className="absolute top-2 right-2 z-20">
        {/* STATUS BUTTON */}
        {status !== "completed" && (
          <button
            onClick={() => {
              setShowStatusMenu((v) => !v);
              setShowRatingMenu(false);
            }}
            className={`text-[10px] px-2 py-1 rounded-full font-medium ${STATUS_COLORS[status]}`}
          >
            {STATUS_LABELS[status]}
          </button>
        )}

        {/* RATING BUTTON */}
        {status === "completed" && (
          <button
            onClick={() => {
              setShowRatingMenu((v) => !v);
              setShowStatusMenu(false);
            }}
            className="text-[15px] px-2 py-1 rounded-full bg-white/60 backdrop-blur text-yellow-400"
          >
            {[1, 2, 3, 4, 5].map((i) => (i <= rating ? "★" : "☆"))}
          </button>
        )}

        {/* STATUS MENU */}
        {showStatusMenu && (
          <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-30 overflow-hidden">
            {["todo", "reading", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  updateItem(item.id, {
                    status: s,
                    rating: s === "completed" ? rating : 0,
                  });
                  setShowStatusMenu(false);
                }}
                className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-100"
              >
                {s === "completed" ? "Completed" : STATUS_LABELS[s]}
              </button>
            ))}

            <div className="border-t my-1" />

            {/* DELETE */}
            <button
              onClick={() => removeItem(item.id)}
              className="block w-full px-3 py-1 text-xs text-left text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}

        {/* RATING MENU */}
        {showRatingMenu && status === "completed" && (
          <div className="absolute right-0 mt-1 bg-white border rounded-full shadow z-30 px-2 py-1 flex items-center gap-1">
            <button
              onClick={() => {
                updateItem(item.id, {
                  status: "todo",
                  rating: 0,
                  ratedAt: null,
                });

                setShowRatingMenu(false);
              }}
              className="text-sm px-1 text-gray-500 hover:text-red-600"
              title="Reset"
            >
              ✕
            </button>

            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  updateItem(item.id, {
                    rating: star,
                    ratedAt: new Date().toISOString().slice(0, 10),
                  });

                  setShowRatingMenu(false);
                }}
                className="text-lg leading-none"
              >
                <span
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* COVER */}
      <div className="relative z-0 w-[120px] aspect-[2/3] mb-3 overflow-hidden rounded">
        <Image
          src={item.cover || "/images/download.png"}
          alt={item.title || "corrupted"}
          fill
          className="object-cover"
          sizes="120px"
        />
      </div>

      {/* TITLE */}
      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
        {item.title}
      </h3>

      {/* SUBTITLE */}
      <p className="mt-1 text-xs text-gray-500 truncate">{item.subtitle}</p>

      {/* YEAR */}
      {item.year && (
        <p className="text-[11px] text-gray-400 mt-0.5">{item.year}</p>
      )}
    </div>
  );
}
