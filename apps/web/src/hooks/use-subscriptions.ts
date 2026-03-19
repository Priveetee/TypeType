import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubscriptions, subscribe, unsubscribe } from "../lib/api-user";
import type { SubscriptionItem } from "../types/user";
import { useAuth } from "./use-auth";

const KEY = ["subscriptions"];

export function useSubscriptions() {
  const qc = useQueryClient();
  const { isAuthed } = useAuth();

  const query = useQuery({ queryKey: KEY, queryFn: fetchSubscriptions, enabled: isAuthed });

  const add = useMutation({
    mutationFn: (item: Omit<SubscriptionItem, "subscribedAt">) =>
      isAuthed ? subscribe(item) : Promise.resolve(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (channelUrl: string) => (isAuthed ? unsubscribe(channelUrl) : Promise.resolve()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  function isSubscribed(channelUrl: string): boolean {
    return (query.data ?? []).some((s) => s.channelUrl === channelUrl);
  }

  return { query, add, remove, isSubscribed };
}
