"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import SeasonProgressRing from "../SeasonProgressRing";
import { Pen } from "lucide-react";
import {
  updateUserMedia,
  deleteUserMedia,
  updateUserMediaRating,
} from "@/actions/libraryactions";
import ProgressSlider from "../progressslider_v";
/* ---------------- STATUS ---------------- */

const STATUS_LABELS = {
  todo: "To Do",
  doing: "In Progress",
};

const STATUS_COLORS = {
  todo: "bg-gray-200/60 text-gray-700 backdrop-blur",
  doing: "bg-blue-200/60 text-blue-700 backdrop-blur",
};

/* ---------------- AIRING ---------------- */

const AIRING_LABELS = {
  airing: "Airing",
  hiatus: "Hiatus",
  completed: "Completed",
  unknown: "Unknown",
};

const AIRING_COLORS = {
  airing: "bg-blue-200/60 text-blue-700 backdrop-blur",
  hiatus: "bg-yellow-200/60 text-yellow-700 backdrop-blur",
  completed: "bg-green-200/60 text-green-700 backdrop-blur",
  unknown: "bg-gray-200/60 text-gray-700 backdrop-blur",
};

/* ---------------- TYPE ---------------- */

const TYPE_COLORS = {
  anime: "bg-yellow-500/80 text-white",
  movie: "bg-purple-500/70 text-white",
  series: "bg-pink-700/70 text-white",
  game: "bg-gray-500/70 text-white",
  book: "bg-blue-500/70 text-white",
};
const pagetypep={
  multi:"top-16",
  solo:"top-10",
}

export default function Card({ item, onEdit, onUpdated, onDeleted ,tag=null,tagcol=null}) {
  const pathname = usePathname();
  // console.log(tag);
  // const tag={tag};
  /* --------- DATA --------- */
  const status = item.status || "todo";
  const rating = item.rating || 0;
  const updatedAt = item.updated_at;
  const pagetype=pagetypep[pathname.split('/')[1]];
  

  const progress = item.progress_watched || 0;
  const total = item.progress_total || 0;

  const type = item.media?.type;
  const airing = item.airing_status;

  const cardRef = useRef(null);

  /* --------- UI STATE --------- */
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const [showAiringMenu, setShowAiringMenu] = useState(false);
  const [showProgressSlider, setShowProgressSlider] = useState(false);


  /* --------- API HELPERS --------- */

  async function update(data) {
    const updated = await updateUserMedia(item.id, data);
    onUpdated?.(updated);
  }

  async function updateRating(newRating) {
    const updated = await updateUserMediaRating(item.id, newRating);
    onUpdated?.(updated);
  }

  async function remove() {
    if (!confirm("Delete this item?")) return;
    await deleteUserMedia(item.id);
    onDeleted?.(item.id);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowProgressSlider(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group min-w-0 w-50 max-w-full h-75 rounded-lg border bg-white/90 backdrop-blur shadow-lg p-4 flex flex-col items-center text-center relative"
    >
      {/* ✏️ EDIT */}
      {pathname !== "/" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(item);
          }}
          className="absolute bottom-2 left-2 hidden group-hover:flex items-center justify-center  p-1 w-7 h-7 border border-blue-500 rounded-full text-xs text-blue-600 z-30 hover:bg-blue-200"
          title="Edit"
        >
          <Pen />
        </button>
      )}

      {/* TYPE BADGE (dashboard only) */}
      {pathname === "/" && type && (
        <div
          className={`absolute top-2 left-2 z-20 text-[10px] px-1 py-1 font-medium uppercase rounded-lg backdrop-blur ${
            TYPE_COLORS[type] || "bg-gray-400 text-white"
          }`}
        >
          {type}
        </div>
      )}



      {/* PROGRESS (ring + toggle slider) */}
      {pathname !== "/" && (
        <div className="absolute top-2 left-1 z-30 bg-white/40 backdrop-blur-lg rounded-full flex flex-col items-center gap-2">
          {/* RING (click toggles slider) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowProgressSlider((v) => !v);
            }}
          >
            <SeasonProgressRing watched={progress} total={total} />
          </button>

          {/* SLIDER */}
          {showProgressSlider && (
            <ProgressSlider
              watched={progress}
              total={total}
              onCommit={(v) => update({ progress_watched: v })}
            />
          )}
        </div>
      )}
      
     {/* TAG */}
      {tag!==null && (
        <div
          className={`absolute ${pagetype} right-2 z-20 text-[9px] px-3 py-1 font-medium uppercase rounded-lg backdrop-blur ${
            tagcol || "bg-gray-400 text-white"
          }`}
        >
          {tag}
        </div>
      )}
      {/* AIRING STATUS (anime page only) */}
      {pathname.split("/")[1] === "multi" && airing && (
        <div className="absolute top-9 right-2 z-20">
          <button
            onClick={() => {
              setShowAiringMenu((v) => !v);
              setShowStatusMenu(false);
              setShowRatingMenu(false);
            }}
            className={`text-[10px] px-2 py-1 rounded-full font-medium ${
              AIRING_COLORS[airing] || "bg-gray-200 text-gray-700"
            }`}
          >
            {AIRING_LABELS[airing]}
          </button>
        

          {showAiringMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-30 overflow-hidden">
              {["airing", "hiatus", "completed", "unknown"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    update({ airing_status: s });
                    setShowAiringMenu(false);
                  }}
                  className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-100"
                >
                  {AIRING_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}


      {/* STATUS / RATING */}
      <div className="absolute top-2 right-2 z-20">
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
        {pathname !== "/" && showStatusMenu && (
          <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-30 overflow-hidden">
            {["todo", "doing", "completed"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  if (s === "completed") {
                    update({ status: "completed" });
                  } else {
                    update({
                      status: s,
                      rating: 0,
                    });
                  }
                  setShowStatusMenu(false);
                }}
                className="block w-full px-3 py-1 text-xs text-left hover:bg-gray-100"
              >
                {s === "completed" ? "Completed" : STATUS_LABELS[s]}
              </button>
            ))}

            <div className="border-t my-1" />

            <button
              onClick={remove}
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
                updateRating(0);
                update({ status: "todo" });
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
                  updateRating(star);
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
          src={item.media?.cover_url || "/images/download.png"}
          alt={item.media?.title || "media"}
          fill
          className="object-cover"
          sizes="120px"
          unoptimized
        />
      </div>

      {/* TITLE */}
      <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-black ">
        {item.media?.title}
      </h3>

      {/* SYNOPSIS (UserMedia) */}
      {item.synopsis && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {item.synopsis}
        </p>
      )}

      {/* YEAR */}
      {item.media?.release_year && (
        <p className="text-[11px] text-gray-400 mt-0.5">
          {item.media.release_year}
        </p>
      )}

      {/* UPDATED DATE (only meaningful for rating) */}
      {status === "completed" && updatedAt && (
        <div className="text-[8px] text-gray-500 absolute bottom-2 right-2 z-30">
          <p className="pl-1">Rated on </p>
          {new Date(updatedAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })}
        </div>
      )}
    </div>
  );
}
