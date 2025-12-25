"use client";
import Card from "@/components/common/card";
import { tempMovies } from "@/data/tempmovies";
export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-purple-600 to-white">
       <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-6 p-6">
      {tempMovies.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
    </div>
  );
}
