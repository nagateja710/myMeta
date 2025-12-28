import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLibraryStore = create(
  persist(
    (set) => ({
      items: [],
      hydrated: false,

      /* 🔥 RESET LIBRARY ON LOGOUT */
      resetLibrary: () =>
        set({
          items: [],
          hydrated: false,
        }),

      /* 🔥 HYDRATE ON LOGIN */
      hydrateLibrary: (items) =>
        set({
          items,
          hydrated: true,
        }),

      addItem: (item) =>
        set((state) => ({
          items: [item, ...state.items],
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
    }),
    {
      name: "mymeta-library",
    }
  )
);
