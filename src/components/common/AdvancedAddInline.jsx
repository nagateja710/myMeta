"use client";

import Image from "next/image";
import { useState } from "react";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function AdvancedAddInline({ item, mode = "edit", onCancel }) {
  const addItem = useLibraryStore((s) => s.addItem);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);
  const [form, setForm] = useState({
    title: item.title || "",
    subtitle: item.subtitle || "",
    year: item.year || "",
    status: item.status || "todo",
    rating: item.rating || 0,
    ratedAt: item.ratedAt || "2027", // 👈 ADD THIS
    totalSeasons: item.progress?.totalSeasons || "",
    seasonsWatched: item.progress?.seasonsWatched || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function save() {
    const payload = {
  title: form.title,
  subtitle: form.subtitle,
  year: form.year,
  status: form.status,
  rating: form.status === "todo" ? 0 : form.rating,
  ratedAt: form.status === "completed" || "ongoing" ? form.ratedAt : null,
  progress: {
    totalSeasons: Number(form.totalSeasons) || 0,
    seasonsWatched: Number(form.seasonsWatched) || 0,
  },
};


    if (mode === "add") {
      addItem({
        id: crypto.randomUUID(),
        cover: item.cover,
        type: item.type,
        addedAt: new Date().toISOString().slice(0, 10),
        ...payload,
      });
    } else {
      updateItem(item.id, payload);
    }

    onCancel();
  }

  return (
    <div className="relative z-30 w-full max-w-[520px] rounded-xl border bg-white p-4 shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-semibold">
            {mode === "add" ? "Add Item" : "Edit Item"}
          </h3>

          {/* STATUS PILLS */}
          <div className="flex gap-1">
            {["todo", "reading", "completed"].map((s) => (
              <button
                key={s}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    status: s,
                    rating: s === "todo" ? 0 : f.rating,
                  }))
                }
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

          {/* ⭐ RATING (only if not todo) */}
          {form.status !== "todo" && (
            <div className="flex gap-0.5 ml-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setForm((f) => ({ ...f, rating: i }))}
                  className={`text-sm ${
                    i <= form.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  title={`${i} star`}
                >
                  ★
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            if (confirm("Delete this item?")) {
              removeItem(item.id);
              onCancel();
            }
          }}
          className=" rounded-full text-lg text-black hover:text-red-600"
          title="Delete"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-[110px_1fr] gap-4 mt-2">
        {/* IMAGE */}
        <div className="flex justify-center">
          <Image
            src={item.cover}
            alt={form.title}
            width={110}
            height={165}
            className="rounded-md object-cover"
          />
        </div>

        {/* FIELDS */}
        <div className="flex flex-col gap-2 min-w-0">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border px-2 py-1.5 rounded text-sm w-full"
          />

          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle / Studio"
            className="border px-2 py-1.5 rounded text-sm w-full"
          />

          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Year"
            className="border px-2 py-1.5 rounded text-sm w-28"
          />

          {/* RATED DATE */}
          {form.status != "todo" && (
            <input
              type="date"
              name="ratedAt"
              value={form.ratedAt}
              onChange={handleChange}
              className="border px-2 py-1.5 rounded text-sm w-40"
            />
          )}

          {/* PROGRESS */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <input
              name="seasonsWatched"
              placeholder="Watched"
              value={form.seasonsWatched}
              onChange={handleChange}
              className="border px-2 py-1.5 rounded text-sm"
            />
            <input
              name="totalSeasons"
              placeholder="Total"
              value={form.totalSeasons}
              onChange={handleChange}
              className="border px-2 py-1.5 rounded text-sm"
            />
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
          className="bg-black text-white px-4 py-1.5 rounded text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
