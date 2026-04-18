import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addHistory, clearHistory, fetchHistory, removeHistory } from "../lib/api-user";
import type { HistoryItem } from "../types/user";
import { useAuth } from "./use-auth";
import { useDebouncedValue } from "./use-debounced-value";

const PAGE_SIZE = 40;

const historyKey = (q: string) => ["history", q];

export function useHistory(searchQuery = "") {
  const qc = useQueryClient();
  const { authReady, isAuthed } = useAuth();
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  const query = useInfiniteQuery({
    queryKey: historyKey(debouncedQuery),
    queryFn: ({ pageParam = 0 }) =>
      fetchHistory({
        q: debouncedQuery || undefined,
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, pages) => {
      const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
      return fetched < lastPage.total ? fetched : undefined;
    },
    initialPageParam: 0,
    enabled: authReady && isAuthed,
  });

  const add = useMutation({
    mutationFn: async (item: Omit<HistoryItem, "id" | "watchedAt">) => {
      if (!isAuthed) return;
      const cached = qc.getQueryData<{ pages: { items: HistoryItem[] }[] }>(historyKey(""));
      const existing = cached?.pages.flatMap((p) => p.items).find((h) => h.url === item.url);
      if (existing) await removeHistory(existing.id);
      await addHistory(item);
    },
    onSuccess: () =>
      qc
        .invalidateQueries({ queryKey: ["history"] })
        .then(() => qc.invalidateQueries({ queryKey: ["history-all"] })),
  });

  const remove = useMutation({
    mutationFn: (id: string) => (isAuthed ? removeHistory(id) : Promise.resolve()),
    onSuccess: () =>
      qc
        .invalidateQueries({ queryKey: ["history"] })
        .then(() => qc.invalidateQueries({ queryKey: ["history-all"] })),
  });

  const clear = useMutation({
    mutationFn: () => (isAuthed ? clearHistory() : Promise.resolve()),
    onSuccess: () =>
      qc
        .invalidateQueries({ queryKey: ["history"] })
        .then(() => qc.invalidateQueries({ queryKey: ["history-all"] })),
  });

  const total = query.data?.pages[0]?.total ?? 0;
  const rawItems = query.data?.pages.flatMap((p) => p.items) ?? [];
  const seen = new Set<string>();
  const items = rawItems.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return { query, items, total, add, remove, clear };
}
