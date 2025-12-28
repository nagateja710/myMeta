import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false, // 🔥 ADD THIS

      login: (userData) => {
        set({ user: userData });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null });
      },
    }),
    {
      name: "mymeta-auth",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state.hasHydrated = true; // 🔥 MARK READY
      },
    }
  )
);
