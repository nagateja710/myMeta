"use client";
import Card from "@/components/common/card";
import { tempBooks } from "@/data/tempbooks";
export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-400 to-white">
       <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-6 p-6">
      {tempBooks.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
    </div>
  );
}
