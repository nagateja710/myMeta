"use client";

import { apiFetch } from "@/lib/api";

/**
 * Add a media item to the user's library
 * Media is identified by title + type (backend creates/reuses Media)
 */
export async function addToLibrary(media) {
  return apiFetch("/add-to-library/", {
    method: "POST",
    body: JSON.stringify({
      // 🔹 media identity (REQUIRED)
      title: media.title,
      type: media.type,

      // 🔹 optional shared fields
      release_year: media.release_year ?? null,
      cover_url: media.cover_url ?? "",

      // 🔹 user defaults
      status: "todo",
      airing_status: "unknown",
      rating: 0,
      progress_watched: 0,
      progress_total: 0,

      // 🔹 user-specific text
      synopsis: "",
      notes: "",
      updated_at: new Date().toISOString()
      
    }),
  });
}
