"use client";

import { apiFetch } from "@/lib/api";

/* ---------------- FETCH ---------------- */

export async function fetchUserLibrary() {
  return apiFetch("/api/user-media/");
}


/* ---------------- HELPERS ---------------- */

function normalizeUpdate(data) {
  const payload = {};

  if ("status" in data) {
    payload.status = data.status ?? "todo";
  }

  if ("rating" in data) {
    payload.rating =
      data.status === "todo" ? 0 : data.rating ?? 0;
  }

  if ("progress_watched" in data) {
    payload.progress_watched = Number(data.progress_watched) || 0;
  }

  if ("progress_total" in data) {
    payload.progress_total = Number(data.progress_total) || 100;
  }

  if ("synopsis" in data) {
    payload.synopsis = data.synopsis ?? "";
  }

  if ("notes" in data) {
    payload.notes = data.notes ?? "";
  }
    if ("airing_status" in data) {
    payload.airing_status = data.airing_status;
  }

  if (data.updated_at) {
    payload.updated_at = data.updated_at;
  }

  return payload;
}

/* ---------------- ADD ---------------- */

export async function addToLibrary(data) {
  const payload = {
    title: data.title,
    type: data.type,
    release_year: data.release_year,
    cover_url: data.cover_url,

    status: data.status ?? "todo",
    rating: data.rating ?? 0,
    progress_watched: Number(data.progress_watched) || 0,
    progress_total: Number(data.progress_total) || 100,
    synopsis: data.synopsis ?? "",
    notes: data.notes ?? "",
  };

   if (data.updated_at) {
    payload.updated_at = data.updated_at;
  }

  return apiFetch("/api/add-to-library/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ---------------- UPDATE ---------------- */

export async function updateUserMedia(id, data) {
  return apiFetch(`/api/user-media/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(normalizeUpdate(data)),
  });
}

/* ---------------- DELETE ---------------- */

export async function deleteUserMedia(id) {
  return apiFetch(`/api/user-media/${id}/`, {
    method: "DELETE",
  });
}

/* ---------------- RATING ---------------- */

export async function updateUserMediaRating(id, rating) {
  return updateUserMedia(id, {
    rating,
    updated_at: new Date().toISOString(),
  });
}
