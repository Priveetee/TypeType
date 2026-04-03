import { create } from "zustand";
import { persist } from "zustand/middleware";

type WatchLayoutStore = {
  cinemaMode: boolean;
  setCinemaMode: (value: boolean) => void;
  toggleCinemaMode: () => void;
};

export const useWatchLayoutStore = create<WatchLayoutStore>()(
  persist(
    (set) => ({
      cinemaMode: false,
      setCinemaMode: (value) => set({ cinemaMode: value }),
      toggleCinemaMode: () => set((state) => ({ cinemaMode: !state.cinemaMode })),
    }),
    { name: "typed-watch-layout" },
  ),
);
