import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { HistoryCard } from "../components/history-card";
import type { FilterState } from "../components/history-filter";
import { HistoryFilter } from "../components/history-filter";
import { ScrollSentinel } from "../components/scroll-sentinel";
import { useHistory } from "../hooks/use-history";
import { fetchHistory } from "../lib/api-user";
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
