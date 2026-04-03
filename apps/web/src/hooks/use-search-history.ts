import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addSearchHistory, clearSearchHistory, fetchSearchHistoryPage } from "../lib/api-user";
import { useAuth } from "./use-auth";

const KEY = ["search-history"];
const PAGE_SIZE = 8;

export function useSearchHistory() {
  const qc = useQueryClient();
  const { isAuthed } = useAuth();
  const query = useInfiniteQuery({
    queryKey: KEY,
    queryFn: ({ pageParam = 1 }) => fetchSearchHistoryPage(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isAuthed,
    gcTime: 0,
  });

  const visibleItems = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  const canLoadMore = visibleItems.length < total;

  const add = useMutation({
    mutationFn: async (term: string) => {
      if (!isAuthed) return;
      await addSearchHistory(term);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  const clear = useMutation({
    mutationFn: () => (isAuthed ? clearSearchHistory() : Promise.resolve()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  function loadMore() {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }

  return {
    query,
    total,
    visibleItems,
    canLoadMore,
    loadMore,
    add,
    clear,
  };
}
