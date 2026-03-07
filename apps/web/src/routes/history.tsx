import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import type { FilterState } from "../components/history-filter";
import { HistoryFilter } from "../components/history-filter";
import { VideoGrid } from "../components/video-grid";
import type { SerializedFilter } from "../stores/history-store";
import { useHistoryStore } from "../stores/history-store";

const MS_PER_DAY = 86_400_000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function toFilterState(f: SerializedFilter): FilterState | null {
  if (f === null) return null;
  if (f.kind === "preset") return f;
  return { kind: "date", date: new Date(f.dateISO) };
}

function toSerialized(f: FilterState | null): SerializedFilter {
  if (f === null) return null;
  if (f.kind === "preset") return f;
  return { kind: "date", dateISO: f.date.toISOString() };
}

function HistoryPage() {
  const {
    entries,
    searchQuery,
    filter: serializedFilter,
    setSearchQuery,
    setFilter,
  } = useHistoryStore();

  const filter = useMemo(() => toFilterState(serializedFilter), [serializedFilter]);

  const handleFilterChange = (f: FilterState | null) => setFilter(toSerialized(f));

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const now = Date.now();

    return entries
      .filter((entry) => {
        const { stream } = entry;
        const watchedAt = new Date(entry.watchedAt);
        if (
          q &&
          !stream.title.toLowerCase().includes(q) &&
          !stream.channelName.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (filter === null) return true;
        if (filter.kind === "preset") {
          const days = (now - watchedAt.getTime()) / MS_PER_DAY;
          if (filter.value === "today") return days < 1;
          if (filter.value === "week") return days < 7;
          if (filter.value === "month") return days < 30;
        }
        if (filter.kind === "date") {
          const dayStart = startOfDay(filter.date);
          const t = watchedAt.getTime();
          return t >= dayStart && t < dayStart + MS_PER_DAY;
        }
        return true;
      })
      .map((entry) => entry.stream);
  }, [entries, searchQuery, filter]);

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 min-w-0">
        <VideoGrid streams={filtered} />
      </div>
      <HistoryFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={handleFilterChange}
        resultCount={filtered.length}
      />
    </div>
  );
}

export const Route = createFileRoute("/history")({ component: HistoryPage });
