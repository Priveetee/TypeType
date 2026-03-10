import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import type { FilterState } from "../components/history-filter";
import { HistoryFilter } from "../components/history-filter";
import { ScrollSentinel } from "../components/scroll-sentinel";
import { useHistory } from "../hooks/use-history";
import { fetchHistory } from "../lib/api-user";
import { formatDuration } from "../lib/format";
import type { HistoryItem } from "../types/user";

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function startOfWeek(date: Date): number {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

function startOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
}

function applyDateFilter(items: HistoryItem[], filter: FilterState | null): HistoryItem[] {
  if (filter === null) return items;
  const now = new Date();
  return items.filter((item) => {
    if (filter.kind === "preset") {
      if (filter.value === "today") return item.watchedAt >= startOfDay(now);
      if (filter.value === "week") return item.watchedAt >= startOfWeek(now);
      if (filter.value === "month") return item.watchedAt >= startOfMonth(now);
    }
    if (filter.kind === "date") {
      const dayStart = startOfDay(filter.date);
      return item.watchedAt >= dayStart && item.watchedAt < dayStart + 86_400_000;
    }
    return true;
  });
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

type HistoryCardProps = { item: HistoryItem; onRemove: () => void; index: number };

function HistoryCard({ item, onRemove, index }: HistoryCardProps) {
  const delay = Math.min(index * 45, 270);
  return (
    <div
      className="flex flex-col gap-2 group relative animate-card-pop-in"
      style={{ animationDelay: `${delay}ms` }}
    >
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterState | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const { query, items, total, remove } = useHistory(searchQuery);

  const allItemsQuery = useQuery({
    queryKey: ["history-all"],
    queryFn: () => fetchHistory({ limit: 10_000 }),
    enabled: filter !== null,
    staleTime: 30_000,
  });

  const sourceItems = filter !== null ? (allItemsQuery.data?.items ?? []) : items;
  const filtered = applyDateFilter(sourceItems, filter);

  return (
    <div className="flex gap-8 items-start">
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {filtered.map((item: HistoryItem, index: number) => (
            <HistoryCard
              key={item.id}
              item={item}
              index={index}
              onRemove={() => setPendingRemoveId(item.id)}
            />
          ))}
        </div>
        <ScrollSentinel
          onIntersect={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
          }}
          enabled={!!query.hasNextPage && !query.isFetchingNextPage && filter === null}
        />
      </div>
      <HistoryFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        resultCount={filter !== null ? filtered.length : total}
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
