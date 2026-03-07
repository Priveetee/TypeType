import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VideoStream } from "../types/stream";

export type HistoryEntry = {
  stream: Omit<VideoStream, "qualityStreams" | "related">;
  watchedAt: string;
};

export type SerializedFilter =
  | { kind: "preset"; value: "today" | "week" | "month" }
  | { kind: "date"; dateISO: string }
  | null;

const MAX_ENTRIES = 200;

type HistoryStore = {
  entries: HistoryEntry[];
  searchQuery: string;
  filter: SerializedFilter;
  addEntry: (stream: VideoStream) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
  setSearchQuery: (q: string) => void;
  setFilter: (filter: SerializedFilter) => void;
};

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],
      searchQuery: "",
      filter: null,
      addEntry: (stream) =>
        set((state) => {
          const { qualityStreams: _qs, related: _rel, ...stripped } = stream;
          const without = state.entries.filter((e) => e.stream.id !== stripped.id);
          const next = [{ stream: stripped, watchedAt: new Date().toISOString() }, ...without];
          return { entries: next.slice(0, MAX_ENTRIES) };
        }),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.stream.id !== id) })),
      clearEntries: () => set({ entries: [] }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilter: (filter) => set({ filter }),
    }),
    { name: "typed-history" },
  ),
);
