import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import type { FilterState } from "../components/history-filter";
import { HistoryFilter } from "../components/history-filter";
import { VideoGrid } from "../components/video-grid";
import { generateHistoryStreams } from "../mocks/streams";
import type { SerializedFilter } from "../stores/history-store";
import { useHistoryStore } from "../stores/history-store";

const MOCK_STREAMS = generateHistoryStreams(24);
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
  const { searchQuery, filter: serializedFilter, setSearchQuery, setFilter } = useHistoryStore();

  const filter = useMemo(() => toFilterState(serializedFilter), [serializedFilter]);

  const handleFilterChange = (f: FilterState | null) => setFilter(toSerialized(f));

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const now = Date.now();

    return MOCK_STREAMS.filter((s) => {
      if (q && !s.title.toLowerCase().includes(q) && !s.channelName.toLowerCase().includes(q)) {
        return false;
      }
      if (filter === null) return true;
      if (filter.kind === "preset") {
        const days = (now - s.uploadedAt.getTime()) / MS_PER_DAY;
        if (filter.value === "today") return days < 1;
        if (filter.value === "week") return days < 7;
        if (filter.value === "month") return days < 30;
      }
      if (filter.kind === "date") {
        const dayStart = startOfDay(filter.date);
        const t = s.uploadedAt.getTime();
        return t >= dayStart && t < dayStart + MS_PER_DAY;
      }
      return true;
    });
  }, [searchQuery, filter]);

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
