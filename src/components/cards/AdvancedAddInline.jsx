"use client";

import Image from "next/image";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Trash2} from "lucide-react";
// import {save}
export default function AdvancedAddInline({
  item,
  mode = "edit", // "add" | "edit"
  onCancel,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);

  // 🔹 Media (read-only)
  const media = item.media || item;

  // 🔹 UserMedia editable fields
  const [form, setForm] = useState({
    status: item.status || "todo",
    rating: item.rating || 0,
    progress_watched: item.progress_watched || 0,
    progress_total: item.progress_total || 0,

    synopsis: item.synopsis || "",
    notes: item.notes || "",

    // date only for UI
    updated_date: item.updated_at
      ? item.updated_at.slice(0, 10)
      : "",
  });

  /* ---------------- HELPERS ---------------- */

  function setStatus(status) {
    setForm((f) => ({
      ...f,
      status,
      rating: status === "todo" ? 0 : f.rating,
    }));
  }

  function setRating(rating) {
    setForm((f) => ({
      ...f,
      rating,
      // auto-fill date when rating if empty
      updated_date:
        f.updated_date || new Date().toISOString().slice(0, 10),
    }));
  }

  function buildUpdatedAt() {
    if (!form.updated_date) return null;

    const now = new Date();
    const time = now.toTimeString().slice(0, 8); // HH:mm:ss
    return `${form.updated_date}T${time}Z`;
  }

  /* ---------------- SAVE ---------------- */

  async function save() {
    setSaving(true);
    try {
      /* ======================
         ADD TO LIBRARY
         ====================== */
      if (mode === "add") {
        const created = await apiFetch("/add-to-library/", {
          method: "POST",
          body: JSON.stringify({
            title: media.title,
            type: media.type,
            release_year: media.release_year,
            cover_url: media.cover_url,

            status: form.status,
            rating: form.rating,
            progress_watched: Number(form.progress_watched) || 0,
            progress_total: Number(form.progress_total) || 0,

            synopsis: form.synopsis,
            notes: form.notes,
          }),
        });

        onSaved?.(created);
      }

      /* ======================
         UPDATE USER MEDIA
         ====================== */
      if (mode === "edit") {
        const payload = {
          status: form.status,
          rating: form.status === "todo" ? 0 : form.rating,
          progress_watched: Number(form.progress_watched) || 0,
          progress_total: Number(form.progress_total) || 0,

          synopsis: form.synopsis,
          notes: form.notes,
        };

        // 🔥 updated_at ONLY if rating/date provided
        const updatedAt = buildUpdatedAt();
        if (updatedAt) {
          payload.updated_at = updatedAt;
        }

        const updated = await apiFetch(`/user-media/${item.id}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        onSaved?.(updated);
      }

      onCancel();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm("Remove this from your library?")) return;

    await apiFetch(`/user-media/${item.id}/`, { method: "DELETE" });
    onSaved?.(null, item.id);
    onCancel();
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="relative z-30 w-full max-w-[560px] rounded-xl border bg-white p-4 shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">
          {mode === "add" ? "Add to Library" : "Update Entry"}
        </h3>

        {mode === "edit" && (
          <button
            onClick={remove}
            className="text-lg hover:text-red-600"
            title="Remove from library"
          >
            <Trash2/>
          </button>
        )}
      </div>

{/* BODY */}
<div className="grid gap-4 grid-cols-[120px_1fr]">


  {/* LEFT COLUMN */}
  <div className="flex flex-col gap-3">
    {/* COVER */}
    <Image
      src={media.cover_url || "/images/download.png"}
      alt={media.title}
      width={120}
      height={180}
      className="rounded-md object-cover"
    />

    {/* NOTES UNDER IMAGE */}
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Notes
      </label>
      <textarea
        rows={5}
        value={form.notes}
        onChange={(e) =>
          setForm((f) => ({ ...f, notes: e.target.value }))
        }
        className="w-full rounded-md border px-3 py-2 text-sm resize-none"
      />
    </div>
  </div>

  {/* RIGHT COLUMN */}
  <div className="flex flex-col gap-4">

    {/* MEDIA INFO */}
    <div>
      <h4 className="font-semibold text-sm">{media.title}</h4>
      {media.release_year && (
        <p className="text-xs text-gray-500">
          {media.release_year}
        </p>
      )}
    </div>

    {/* STATUS */}
    <div className="flex gap-1 flex-wrap">
      {["todo", "doing", "completed"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          className={`px-2 py-0.5 rounded-full text-xs ${
            form.status === s
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {s}
        </button>
      ))}
    </div>

    {/* RATING */}
          {form.status === "completed" && (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setRating(i)}
            className={`text-sm ${
              i <= form.rating
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    )}

    {/* SYNOPSIS (SMALL FIELD) */}
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
         (author / director / tags)
      </label>
      <input
        type="text"
        value={form.synopsis}
        onChange={(e) =>
          setForm((f) => ({ ...f, synopsis: e.target.value }))
        }
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
    </div>

    {/* DATE + PROGRESS (RIGHT OF NOTES) */}
    {/* <div className="grid gap-3 rounded-lg border bg-gray-50 p-3"> */}

      {/* UPDATED DATE */}
     {form.status==="completed" && ( <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Rated / Updated on
        </label>
        <input
          type="date"
          value={form.updated_date}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              updated_date: e.target.value,
            }))
          }
          className="w-full rounded-md border px-3 py-2 text-sm bg-white"
        />
        {/* <p className="text-[11px] text-gray-400 mt-1">
          Time is auto-filled
        </p> */}
      </div>)}

      {/* PROGRESS */}
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1">
          Your progress
        </p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            placeholder="Watched"
            value={form.progress_watched}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                progress_watched: e.target.value,
              }))
            }
            className="border px-2 py-1.5 rounded text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Total"
            value={form.progress_total}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                progress_total: e.target.value,
              }))
            }
            className="border px-2 py-1.5 rounded text-sm"
          />
        </div>
      {/* </div> */}

    </div>
  </div>
</div>

      

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="text-sm text-gray-500">
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="bg-black text-white px-4 py-1.5 rounded text-sm disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
