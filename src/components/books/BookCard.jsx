"use client";

import Image from "next/image";
import { useState } from "react";
import { getBookCover } from "@/utils/bookHelpers";

const STATUS_LABELS = {
  todo: "To Read",
  reading: "Reading",
};

const STATUS_COLORS = {
  todo: "bg-gray-200/60 text-gray-700 backdrop-blur ",
  reading: "bg-blue-200/60 text-blue-700 backdrop-blur ",
};

export default function BookCard({ book }) {
  const title = book.volumeInfo?.title || "Untitled";
  const author = book.volumeInfo?.authors?.[0] || "Unknown";
  // const publishedDate=book.publishedDate || "2002";

  const [status, setStatus] = useState(book.status || "todo");
  const [rating, setRating] = useState(book.rating || 0);

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);

  return (
    <div className="w-[200px] rounded-lg border bg-white p-4 flex flex-col items-center text-center relative">
      {/* STATUS / RATING BADGE */}
      <div className="absolute top-2 right-2">
        {/* TODO / READING BADGE */}
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

        {/* COMPLETED → STARS BADGE */}
        {status === "completed" && (
          <button
            onClick={() => {
              setShowRatingMenu((v) => !v);
              setShowStatusMenu(false);
            }}
            className="text-[15px] px-2 py-1 rounded-full 
           bg-white/60 backdrop-blur 
           
           text-yellow-400"

          >
            {[1, 2, 3, 4, 5].map((i) =>
              i <= rating ? "★" : "☆"
            )}
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

        {/* ⭐ RATING EDIT MENU: ✕ ★ ★ ★ ★ ★ */}
        {showRatingMenu && status === "completed" && (
          <div className="absolute right-0 mt-1 bg-white border rounded-full shadow z-10 px-2 py-1 flex items-center gap-1">
            
            {/* ✕ RESET */}
            <button
              onClick={() => {
                setStatus("todo");
                setRating(0);
                setShowRatingMenu(false);
              }}
              className="text-sm px-1 text-gray-500 hover:text-red-600"
              title="Reset to To Read"
            >
              ✕
            </button>

            {/* STARS */}
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  setShowRatingMenu(false);
                }}
                className="text-lg leading-none"
                title={`Rate ${star} stars`}
              >
                <span
                  className={
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
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
          src={getBookCover(book)}
          alt={title}
          width={120}
          height={180}
          className="rounded object-cover"
        />
      </div>

      {/* TITLE */}
      <h3
        className="font-semibold text-sm leading-tight line-clamp-2"
        title={title}
      >
        {title}
      </h3>

      {/* AUTHOR */}
      <p
        className="mt-1 text-xs text-gray-500 truncate"
        title={author}
      >
        {author}
      </p>
      {/* <p className="mt-1 text-xs text-gray-500 truncate " title={publishedDate}>
        {publishedDate}
      </p> */}
    </div>
  );
}
