"use client";
import Card from "@/components/common/Card";
import { tempGames } from "@/data/tempgames";
export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-400 to-white">
       <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-6 p-6">
      {tempGames.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
    </div>
  );
}
