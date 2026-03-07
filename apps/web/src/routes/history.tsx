import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { FilterState } from "../components/history-filter";
import { HistoryFilter } from "../components/history-filter";
import { VideoGrid } from "../components/video-grid";
import { useHistory } from "../hooks/use-history";
import type { VideoStream } from "../types/stream";
import type { HistoryItem } from "../types/user";

const MS_PER_DAY = 86_400_000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function toStream(item: HistoryItem): VideoStream {
  return {
    id: item.url,
    title: item.title,
    thumbnail: item.thumbnail,
    channelName: item.channelName,
    channelUrl: item.channelUrl,
    channelAvatar: "",
    views: 0,
    duration: item.duration,
    uploadDate: "",
  };
}

function HistoryPage() {
  const { query } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterState | null>(null);

  const filtered = useMemo(() => {
    const entries = query.data ?? [];
    const q = searchQuery.toLowerCase();
    const now = Date.now();

    return entries
      .filter((item) => {
        if (
          q &&
          !item.title.toLowerCase().includes(q) &&
          !item.channelName.toLowerCase().includes(q)
        ) {
          return false;
        }
        if (filter === null) return true;
        const watchedAt = item.watchedAt;
        if (filter.kind === "preset") {
          const days = (now - watchedAt) / MS_PER_DAY;
          if (filter.value === "today") return days < 1;
          if (filter.value === "week") return days < 7;
          if (filter.value === "month") return days < 30;
        }
        if (filter.kind === "date") {
          const dayStart = startOfDay(filter.date);
          return watchedAt >= dayStart && watchedAt < dayStart + MS_PER_DAY;
        }
        return true;
      })
      .map(toStream);
  }, [query.data, searchQuery, filter]);

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 min-w-0">
        <VideoGrid streams={filtered} />
      </div>
      <HistoryFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={filtered.length}
      />
    </div>
  );
}

export const Route = createFileRoute("/history")({ component: HistoryPage });
