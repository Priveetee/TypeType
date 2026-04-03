import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAllNotificationsRead } from "../lib/api-notifications";
import { useAuth } from "./use-auth";

const KEY = ["notifications"];
const PAGE_SIZE = 20;

export function useNotifications() {
  const qc = useQueryClient();
  const { isAuthed, isGuest } = useAuth();
  const enabled = isAuthed && !isGuest;

  const query = useInfiniteQuery({
    queryKey: KEY,
    queryFn: ({ pageParam = 0 }) => fetchNotifications(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => lastPage.nextpage ?? undefined,
    initialPageParam: 0,
    enabled,
    refetchInterval: enabled ? 60_000 : false,
  });

  const markAllRead = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  return {
    query,
    markAllRead,
    unreadCount: query.data?.pages[0]?.unreadCount ?? 0,
    items: query.data?.pages.flatMap((page) => page.items) ?? [],
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    enabled,
  };
}
