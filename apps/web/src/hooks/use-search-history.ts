import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSearchHistory, clearSearchHistory, fetchSearchHistory } from "../lib/api-user";

const KEY = ["search-history"];

export function useSearchHistory() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchSearchHistory });

  const add = useMutation({
    mutationFn: (term: string) => addSearchHistory(term),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const clear = useMutation({
    mutationFn: clearSearchHistory,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, add, clear };
}
