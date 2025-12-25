"use client";

import { useMemo } from "react";
import Card from "@/components/common/card_mymeta";
import { useLibraryStore } from "@/store/useLibraryStore";

export default function BooksPage() {
  const items = useLibraryStore((s) => s.items);

  const books = useMemo(
    () => items.filter((i) => i.type === "books"),
    [items]
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-400 to-white">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 p-6">
          {books.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
    </div>
  );
}
