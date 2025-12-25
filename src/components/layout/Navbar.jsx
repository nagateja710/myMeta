"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Search from "@/components/common/search";
import { Book, Film, Tv, Gamepad2, Users } from "lucide-react";

const activeColor = {
  "/books": "bg-blue-500",
  "/movies": "bg-purple-500",
  "/anime": "bg-yellow-500",
  "/games": "bg-gray-500",
  "/friends": "bg-gradient-to-r from-green-400 to-yellow-400",
};

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `pb-1 transition-colors ${
      pathname === path
        ? `font-semibold border-b-2 text-white rounded px-3 py-1 ${activeColor[path]}`
        : "text-slate-600 hover:text-black px-3 py-1"
    }`;

  const navItems = [
    { path: "/books", label: "Books", icon: Book },
    { path: "/movies", label: "Movies", icon: Film },
    { path: "/anime", label: "Anime", icon: Tv },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/friends", label: "Friends", icon: Users },
  ];

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="sticky top-0 z-50 border-b bg-white backdrop-blur hidden md:block">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-xl font-bold">
              MyMeta
            </Link>

            {navItems.map((item) => (
              <Link key={item.path} href={item.path} className={linkClass(item.path)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="w-[320px]">
            <Search />
          </div>
        </div>
      </nav>

      {/* MOBILE TOP BAR */}
     <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white shadow-sm md:hidden">
        <div className="px-4 flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold">
            MyMeta
          </Link>
          <div className="flex-1 max-w-md ml-4">
            <Search />
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION (Play Store Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? "text-white" : "text-slate-600"
                }`}
              >
                <div
                  className={`flex flex-col items-center justify-center ${
                    isActive ? `rounded-full p-2 ${activeColor[item.path]}` : ""
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile content */}
      <div className="h-16 md:hidden" />
    </>
  );
}
