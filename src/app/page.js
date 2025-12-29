"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

import Dashboard from "@/components/homepage/Dashboard";
import AboutPage from "@/components/homepage/about";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  // 🔐 Restore auth ONCE on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && !user) {
      // temporary user until /me endpoint is added
      login({ username: "user" });
    }

    if (!token && user) {
      logout();
    }
  }, []); // 👈 run once only

  // ⏳ Optional loading guard (only if store hydrates async)
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // ✅ FINAL RENDER
  return user ? <Dashboard /> : <AboutPage />;
}
