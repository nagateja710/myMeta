"use client";

import { useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useLibraryStore } from "@/store/useLibraryStore";

export function LibraryHydrator() {
  const user = useAuthStore((s) => s.user);
  const authHydrated = useAuthStore((s) => s.hasHydrated);

  const resetLibrary = useLibraryStore((s) => s.resetLibrary);
  const hydrateLibrary = useLibraryStore((s) => s.hydrateLibrary);

  useEffect(() => {
    if (!authHydrated) return;

    // 🔒 Logout → clear library
    if (!user) {
      resetLibrary();
      return;
    }

    // 🔥 Always refetch on reload when user exists
    const fetchLibrary = async () => {
      try {
        const data = await apiFetch("/api/user-media/");
        
        hydrateLibrary(data);
        // console.log("Library hydrated:", data);
        
      } catch (err) {
        console.error("Failed to hydrate library", err);
      }
    };

    fetchLibrary();
  }, [authHydrated, user, resetLibrary, hydrateLibrary]);

  return null;
}
