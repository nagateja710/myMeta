"use client";

import { useAuthStore } from "@/store/useAuthStore";

import Dashboard from "@/components/homepage/Dashboard";
import AboutPage from "@/components/homepage/about";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  // ✅ Just render - no useEffect needed!
  return user ? <Dashboard /> : <AboutPage />;
}
