"use client";

import Image from "next/image";
import { useState } from "react";

const STATUS_LABELS = {
  todo: "To Do",
  reading: "In Progress",
};

const STATUS_COLORS = {
  todo: "bg-gray-200/60 text-gray-700 backdrop-blur",
  reading: "bg-blue-200/60 text-blue-700 backdrop-blur",
};

export default function Card({ item }) {
  const [status, setStatus] = useState(item.status || "todo");
  const [rating, setRating] = useState(item.rating || 0);
  const [addeddate,SetAddeddate]=useState(item.addedAt || "2025" );
  

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  return (
    <div className="w-[200px] rounded-lg border bg-white p-4 flex flex-col items-center text-center relative">
       {status==="completed" && (<div className={`absolute bottom-2 right-2 mt-1 w-15 text-[9px] px-1 py-1  text-gray-400 `}>
         {addeddate}
         </div>)}
      <div className="absolute top-2 right-2">
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
          <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow z-10">
            {["todo", "reading", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  if (s !== "completed") setRating(0);
                  setShowStatusMenu(false);
                }}
                className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-100"
              >
                {s === "completed" ? "Completed" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}

        {/* RATING MENU */}
        {showRatingMenu && status === "completed" && (
          <div className="absolute right-0 mt-1 bg-white border rounded-full shadow z-10 px-2 py-1 flex items-center gap-1">
            <button
              onClick={() => {
                setStatus("todo");
                setRating(0);
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
                  setRating(star);
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
      <div className="mb-3">
        <Image
          src={item.cover || "/images/download.png"}
          alt={item.title || "corrupted"}
          width={120}
          height={180}
          className="rounded object-cover"
        />
      </div>

      {/* TITLE */}
      <h3
        className="font-semibold text-sm leading-tight line-clamp-2"
        title={item.title}
      >
        {item.title}
      </h3>

      {/* SUBTITLE */}
      <p
        className="mt-1 text-xs text-gray-500 truncate"
        title={item.subtitle}
      >
        {item.subtitle}
      </p>

      {/* YEAR */}
      {item.year && (
        <p className="text-[11px] text-gray-400 mt-0.5">
          {item.year}
        </p>
      )}
    </div>
  );
}
