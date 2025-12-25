"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "@/components/common/search";

const activeColor = {
  "/books": "bg-blue-500 ",
  "/movies": "bg-purple-500",
  "/anime": "bg-yellow-500",
  "/games": "bg-gray-500",
  "/friends":"bg-linear-100 from-green-400  to-yellow-400",
};

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `pb-1 transition-colors ${
      pathname === path
        ? `font-semibold border-b-2 text-white rounded px-3 py-1 ${activeColor[path]}`
        : "text-slate-600 hover:text-black px-3 py-1"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
        
        {/* LEFT: Logo + Navigation */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-xl font-bold">
            MyMeta
          </Link>

          <Link href="/books" className={linkClass("/books")}>
            Books
          </Link>
          <Link href="/movies" className={linkClass("/movies")}>
            Movies
          </Link>
          <Link href="/anime" className={linkClass("/anime")}>
            Anime
          </Link>
          <Link href="/games" className={linkClass("/games")}>
            Games
          </Link>
          <Link href="/friends" className={linkClass("/friends")}>
            FRIENDS
          </Link>
        </div>

        {/* RIGHT: Search Bar */}
        <div className="w-[320px]">
          <Search />
        </div>

      </div>
    </nav>
  );
}
