import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addHistory, clearHistory, fetchHistory, removeHistory } from "../lib/api-user";
import type { HistoryItem } from "../types/user";

const KEY = ["history"];

export function useHistory() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchHistory });

  const add = useMutation({
    mutationFn: (item: Omit<HistoryItem, "id" | "watchedAt">) => addHistory(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => removeHistory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const clear = useMutation({
    mutationFn: clearHistory,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, add, remove, clear };
}
