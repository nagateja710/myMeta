"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import Search from "@/components/searchs/search";

import {
  Book,
  Film,
  Tv,
  Gamepad2,
  Users,
  UserCircle,
  LogIn,
  UserPlus,
  LogOut,
  TvMinimalPlay,
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { useLibraryStore } from "@/store/useLibraryStore";

/* ======================================================
   🎯 ALL POSSIBLE NAV ITEMS (SINGLE SOURCE OF TRUTH)
====================================================== */
const navItems = [
  { key: "books", label: "Books", path: "/solo/books", icon: Book },
  { key: "movies", label: "Movies", path: "/solo/movies", icon: Film },
  { key: "series", label: "Series", path: "/multi/series", icon: TvMinimalPlay },
  { key: "anime", label: "Anime", path: "/multi/anime", icon: Tv },
  
  { key: "games", label: "Games", path: "/solo/games", icon: Gamepad2 },
  // { key: "friends", label: "Friends", path: "/temp/friends", icon: Users }, //for future
];

/* ======================================================
   🎨 ACTIVE COLORS
====================================================== */
const activeColor = {
  "/solo/books": "bg-blue-500",
  "/solo/movies": "bg-purple-500",
  "/multi/anime": "bg-yellow-500",
  "/multi/series": "bg-rose-600",
  "/solo/games": "bg-gray-500",
  "/friends": "bg-gradient-to-r from-green-400 to-yellow-400",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const resetLibrary = useLibraryStore((s) => s.resetLibrary);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const [open, setOpen] = useState(false);


  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  /* ======================================================
     ❌ CLOSE MENU ON OUTSIDE CLICK
  ====================================================== */
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  /* ======================================================
     🚪 LOGOUT
  ====================================================== */
  function handleLogout() {
    resetLibrary();
    logout();
    setOpen(false);
    router.push("/");
  }

  /* ======================================================
     📌 LINK CLASS
  ====================================================== */
  const linkClass = (path) =>
    pathname === path
      ? `font-semibold text-white rounded px-3 py-1 ${
          activeColor[path] ?? "bg-black"
        }`
      : "text-slate-600 hover:text-black px-3 py-1";

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur hidden md:block">
        <div className="mx-auto text- max-w-7xl px-6 flex items-center justify-between h-14">
          {/* LEFT */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-xl font-bold">
              MyMeta
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.key}
                href={user ? item.path : "/auth/signin"}
                className={linkClass(item.path)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* RIGHT */}
          <div
            className="flex items-center gap-3 flex-1 justify-end relative"
            ref={menuRef}
          >
            {hasHydrated && user && (
              <span className="text-sm text-slate-700">
                Hi{" "}
                <span
                  className={`${
                    activeColor[pathname] ?? "bg-black"
                  } text-white px-2 py-1 rounded font-semibold uppercase`}
                >
                  {user.username}
                </span>
              </span>
            )}

            <div className="w-[320px]">
              <Search />
            </div>

            {!user ? (
              <>
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-1 text-sm text-slate-600"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-black text-white text-sm"
                >
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Profile"
                >
                  <UserCircle size={30} className="text-blue-500" />
                </button>

                {open && (
                  <div className="absolute right-0 top-12 w-64 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold">
                        Signed in as
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.username}
                      </p>
                    </div>

      

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ================= MOBILE TOP BAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b md:hidden">
        <div className="px-3 h-14 flex items-center gap-2">
          <Link href="/" className="text-xl font-bold">
            MyMeta
          </Link>

          <div className="flex-1 min-w-0">
            <Search />
          </div>

          <button
            onClick={() =>
              !user ? router.push("/auth/signin") : setOpen((v) => !v)
            }
          >
            <UserCircle size={24} />
          </button>
        </div>

        {user && open && (
          <div
            ref={mobileMenuRef}
            className="absolute right-3 top-14 w-64 bg-white border rounded-lg shadow-lg z-50"
          >
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold truncate">
                {user.username}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-t md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.key}
                href={user ? item.path : "/auth/signin"}
                className={`flex flex-col items-center rounded-full m-3 justify-center flex-2 py-1 ${
                  isActive
                    ? `${activeColor[item.path]} text-white`
                    : "text-slate-500"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="h-16 md:hidden" />
    </>
  );
}
