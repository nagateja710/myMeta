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
  const libraryHydrated = useLibraryStore((s) => s.hydrated);
 // In useAuthStore
const initializeUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      set({ user: { username: decoded.username } });
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
};

  useEffect(() => {
    if (!authHydrated) return;


    // 🔒 User logged out → clear library
    if (!user) {
      resetLibrary();
      return;
    }

    // 🔥 User logged in / reload → fetch ONCE
    if (user && !libraryHydrated) {
      (async () => {
        try {
          const data = await apiFetch("/api/user-media/");
          hydrateLibrary(data);
        } catch (err) {
          console.error("Failed to hydrate library", err);
        }
      })();
    }
  }, [user, authHydrated, libraryHydrated, resetLibrary, hydrateLibrary]);

  return null; // invisible controller
}
