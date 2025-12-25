       


"use client";
// import Card from "@/components/common/card_2";
// import { tempMovies } from "@/data/tempmovies";
export default function tt({x,colour}) {
    // console.log();
  return (
    <div className={`absolute top-2 left-2 mt-1 w-15 text-[10px] px-1 py-1 rounded-full font-medium  text-white ${colour} backdrop-blur rounded-lg`}>
         {x}
    </div>
  );
}
