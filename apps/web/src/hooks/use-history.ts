import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addHistory, clearHistory, fetchHistory, removeHistory } from "../lib/api-user";
import type { HistoryItem } from "../types/user";

const PAGE_SIZE = 40;

const historyKey = (q: string) => ["history", q];

export function useHistory(searchQuery = "") {
  const qc = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: historyKey(searchQuery),
    queryFn: ({ pageParam = 0 }) =>
      fetchHistory({ q: searchQuery || undefined, limit: PAGE_SIZE, offset: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const fetched = pages.reduce((sum, p) => sum + p.items.length, 0);
      return fetched < lastPage.total ? fetched : undefined;
    },
    initialPageParam: 0,
  });

  const add = useMutation({
    mutationFn: async (item: Omit<HistoryItem, "id" | "watchedAt">) => {
      const cached = qc.getQueryData<{ pages: { items: HistoryItem[] }[] }>(historyKey(""));
      const existing = cached?.pages.flatMap((p) => p.items).find((h) => h.url === item.url);
      if (existing) await removeHistory(existing.id);
      await addHistory(item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["history"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeHistory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["history"] }),
  });

  const clear = useMutation({
    mutationFn: clearHistory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["history"] }),
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
