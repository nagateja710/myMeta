"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { useLibraryStore } from "@/store/useLibraryStore"; // ✅ ADD THIS

const activeColor = {
  "/books": "bg-blue-500",
  "/movies": "bg-purple-500",
  "/anime": "bg-yellow-500",
  "/games": "bg-gray-500",
  "/friends": "bg-gradient-to-r from-green-400 to-yellow-400",
  "/": "bg-gradient-to-r from-blue-400 to-purple-400",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
 const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const resetLibrary = useLibraryStore((s) => s.reset); // ✅ ADD THIS

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { path: "/books", label: "Books", icon: Book },
    { path: "/movies", label: "Movies", icon: Film },
    { path: "/anime", label: "Anime", icon: Tv },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/friends", label: "Friends", icon: Users },
  ];

  const linkClass = (path) =>
    pathname === path
      ? `font-semibold border-b-2 text-white rounded px-3 py-1 ${
          activeColor[path] ?? "bg-black"
        }`
      : "text-slate-600 hover:text-black px-3 py-1";

  /* ================= LOGOUT HANDLER ================= */
  function handleLogout() {
    resetLibrary();   // 🔥 CLEAR USER DATA
    logout();         // 🔥 CLEAR AUTH
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b bg-white hidden md:block">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-14">
          {/* LEFT */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-xl font-bold">
              MyMeta
            </Link>

            {navItems.map((item) => (
              <Link
                key={item.path}
                href={user ? item.path : "/"}
                className={linkClass(item.path)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* RIGHT */}
          <div
            className="flex items-center gap-3 flex-1 relative justify-end"
            ref={menuRef}
          >
{/* USER GREETING */}
{hasHydrated && user && (
  <span className="font-medium text-slate-700 whitespace-nowrap">
    Hi{" "}
    <span
      className={`${
        activeColor[pathname] ?? "bg-black"
      } rounded text-white px-2 py-1 uppercase font-semibold`}
    >
      {user.username}
    </span>{" "}
    welcome!
  </span>
)}


            <div className="w-[320px]">
              <Search />
            </div>

            {/* AUTH */}
            {!user ? (
              <>
                <Link
                  href="/signin"
                  className="flex items-center gap-1 text-sm text-slate-600"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>

                <Link
                  href="/signup"
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
                  className="flex items-center"
                  aria-label="Profile"
                >
                  <UserCircle className="text-blue-500" size={30} />
                </button>

                {open && (
                  <div className="absolute right-0 top-12 w-56 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b md:hidden">
        <div className="px-3 h-14 flex items-center gap-2">
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
            MyMeta
          </Link>

          <div className="pl-6 flex-1 min-w-0">
            <Search />
          </div>

          <button
            onClick={() => {
              if (!user) router.push("/signin");
              else setOpen((v) => !v);
            }}
            className="shrink-0"
          >
            <UserCircle size={24} />
          </button>
        </div>

        {user && open && (
          <div className="absolute right-3 top-14 w-56 bg-white border rounded-lg shadow-lg z-50">
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center rounded-full py-1 flex-1 ${
                  isActive
                    ? `${activeColor[pathname] ?? "bg-black"} text-white`
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
