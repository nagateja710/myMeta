"use client";
import Card from "@/components/common/card_2";
import { tempAnime } from "@/data/tempanime";
// import { tempGames } from "@/data/tempGames";
export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-400 to-white">
       <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-6 p-6">
 {tempAnime.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
    </div>
  );
}


