import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SerializedFilter =
  | { kind: "preset"; value: "today" | "week" | "month" }
  | { kind: "date"; dateISO: string }
  | null;

type HistoryStore = {
  searchQuery: string;
  filter: SerializedFilter;
  setSearchQuery: (q: string) => void;
  setFilter: (filter: SerializedFilter) => void;
};

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      searchQuery: "",
      filter: null,
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilter: (filter) => set({ filter }),
    }),
    { name: "typed-history" },
  ),
);
