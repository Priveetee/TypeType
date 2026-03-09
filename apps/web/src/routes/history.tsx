import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import type { FilterState } from "../components/history-filter";
import { HistoryFilter } from "../components/history-filter";
import { useHistory } from "../hooks/use-history";
import { formatDuration } from "../lib/format";
import type { HistoryItem } from "../types/user";

const MS_PER_DAY = 86_400_000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Remove"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type HistoryCardProps = {
  item: HistoryItem;
  onRemove: () => void;
};

function HistoryCard({ item, onRemove }: HistoryCardProps) {
  return (
    <div className="flex flex-col gap-2 group relative">
      <Link to="/watch" search={{ v: item.url }} className="block">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {item.duration > 0 && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1 rounded">
              {formatDuration(item.duration)}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            aria-label="Remove from history"
            className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XIcon />
          </button>
        </div>
      </Link>
      <div className="flex flex-col gap-0.5 min-w-0">
        <Link to="/watch" search={{ v: item.url }}>
          <p className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug">
            {item.title}
          </p>
        </Link>
        <p className="text-xs text-zinc-400">{item.channelName}</p>
      </div>
    </div>
  );
}

function HistoryPage() {
  const { query, remove } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterState | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const entries = query.data ?? [];
    const seen = new Map<string, HistoryItem>();
    for (const item of entries) {
      const existing = seen.get(item.url);
      if (!existing || item.watchedAt > existing.watchedAt) {
        seen.set(item.url, item);
      }
    }
    const deduped = Array.from(seen.values());
    const q = searchQuery.toLowerCase();
    const now = Date.now();
    return deduped.filter((item) => {
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
    });
  }, [query.data, searchQuery, filter]);

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {filtered.map((item: HistoryItem) => (
            <HistoryCard key={item.id} item={item} onRemove={() => setPendingRemoveId(item.id)} />
          ))}
        </div>
      </div>
      <HistoryFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={filtered.length}
      />
      {pendingRemoveId !== null && (
        <ConfirmModal
          title="Remove from history?"
          description="This video will be removed from your watch history."
          confirmLabel="Remove"
          onConfirm={() => {
            remove.mutate(pendingRemoveId);
            setPendingRemoveId(null);
          }}
          onCancel={() => setPendingRemoveId(null)}
        />
      )}
    </div>
  );
}

export const Route = createFileRoute("/history")({ component: HistoryPage });
