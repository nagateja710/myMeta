"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/books", label: "Books", icon: "📚" },
  { href: "/movies", label: "Movies", icon: "🎬" },
  { href: "/anime", label: "Anime", icon: "📺" },
  { href: "/games", label: "Games", icon: "🎮" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        z-50
        bg-white border-t
        flex justify-around
        py-2
        md:hidden
      "
    >
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-blue-600 font-medium" : "text-gray-500"
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
