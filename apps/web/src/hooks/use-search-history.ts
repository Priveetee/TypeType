import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearSearchHistory, fetchSearchHistory } from "../lib/api-user";

const KEY = ["search-history"];

export function useSearchHistory() {
  const qc = useQueryClient();

  const query = useQuery({ queryKey: KEY, queryFn: fetchSearchHistory });

  const clear = useMutation({
    mutationFn: clearSearchHistory,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, clear };
}
