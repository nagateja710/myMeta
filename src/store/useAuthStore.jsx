import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,

      login: (userData) => {
        set({ user: userData });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null });
      },

      // 🔥 ADD this setter function
      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated });
      },
    }),
    {
      name: "mymeta-auth",
      partialize: (state) => ({ user: state.user }), // Only persist user
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true); // ✅ Call the setter
        }
      },
    }
  )
);
