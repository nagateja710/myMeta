"use client";

import Image from "next/image";
import { useState } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";
import SeasonProgressRing from "./SeasonProgressRing";

const STATUS_LABELS = {
  todo: "Todo",
  reading: "Ongoing",
  completed: "Completed",
};

const STATUS_COLORS = {
  todo: "bg-gray-200 text-gray-700",
  reading: "bg-blue-200 text-blue-700",
  completed: "bg-green-200 text-green-700",
};

export default function AnimeCard({ item, onEdit }) {
  const { updateItem, removeItem } = useLibraryStore();

  const status = item.status || "todo";
  const rating = item.rating || 0;
  const addeddate = item.addedAt || "2025";
  const totalSeasons = item.progress?.totalSeasons || 0;
  const seasonsWatched = item.progress?.seasonsWatched || 0;

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  return (
    <div className="group w-50 h-75 rounded-lg border bg-white p-4 flex flex-col items-center text-center relative">
      {/* ✏️ EDIT ICON */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="
           absolute bottom-2 left-2
          hidden group-hover:flex
          w-7 h-7
          items-center justify-center
          rounded-full
         text-sm border border-amber-600
          z-30
        "
        title="Edit"
      >
        ✏️
      </button>

      {/* COMPLETED DATE */}
      {status !== "todo" && (
        <div className="absolute bottom-2 right-2 z-10 text-[9px] text-gray-400">
          {item.ratedAt}
        </div>
      )}

      {/* 🔵 PROGRESS */}
      <div className="absolute top-2 left-2 z-30">
        <SeasonProgressRing watched={seasonsWatched} total={totalSeasons} />
      </div>

      {/* 🔖 STATUS + RATING */}
      <div className="absolute top-2 right-2 z-30 flex flex-col items-end gap-1">
        <button
          onClick={() => {
            setShowStatusMenu((v) => !v);
            setShowRatingMenu(false);
          }}
          className={`text-[10px] px-2 py-1 rounded-full font-medium ${STATUS_COLORS[status]}`}
        >
          {STATUS_LABELS[status]}
        </button>

        {showStatusMenu && (
          <div className="absolute right-0 top-6 w-28 bg-white border rounded shadow z-30">
            {["todo", "reading", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  updateItem(item.id, {
                    status: s,
                    rating: s === "todo" ? 0 : rating,
                  });
                  setShowStatusMenu(false);
                }}
                className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-100"
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}

        {status !== "todo" && (
          <button
            onClick={() => {
              setShowRatingMenu((v) => !v);
              setShowStatusMenu(false);
            }}
            className="text-[13px] px-2 py-0.5 rounded-full bg-white/70 backdrop-blur text-yellow-400"
          >
            {[1, 2, 3, 4, 5].map((i) => (i <= rating ? "★" : "☆"))}
          </button>
        )}

        {showRatingMenu && status !== "todo" && (
          <div className="absolute right-0 top-[42px] bg-white border rounded-full shadow z-30 px-2 py-1 flex gap-1">
            <button
              onClick={() => {
                updateItem(item.id, {
                  status: "todo",
                  rating: 0,
                  ratedAt: null,
                });

                setShowRatingMenu(false);
              }}
              className="text-sm text-gray-500"
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
                className="text-lg"
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
      <div className="relative w-[120px] aspect-[2/3] mb-3 overflow-hidden rounded">
        <Image
          src={item.cover || "/images/download.png"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
        {item.title}
      </h3>

      {item.subtitle && (
        <p className="mt-1 text-xs text-gray-500 truncate">{item.subtitle}</p>
      )}

      {item.year && (
        <p className="text-[11px] text-gray-400 mt-0.5">{item.year}</p>
      )}
    </div>
  );
}
