import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSubscriptions, subscribe, unsubscribe } from "../lib/api-user";
import type { SubscriptionItem } from "../types/user";

const KEY = ["subscriptions"];

export function useSubscriptions() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchSubscriptions });

  const add = useMutation({
    mutationFn: (item: Omit<SubscriptionItem, "subscribedAt">) => subscribe(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (channelUrl: string) => unsubscribe(channelUrl),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  function isSubscribed(channelUrl: string): boolean {
    return (query.data ?? []).some((s) => s.channelUrl === channelUrl);
  }

  return { query, add, remove, isSubscribed };
}
