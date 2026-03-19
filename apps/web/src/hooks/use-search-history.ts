import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addSearchHistory, clearSearchHistory, fetchSearchHistory } from "../lib/api-user";
import { useAuth } from "./use-auth";

const KEY = ["search-history"];

export function useSearchHistory() {
  const qc = useQueryClient();
  const { isAuthed } = useAuth();

  const query = useQuery({ queryKey: KEY, queryFn: fetchSearchHistory, enabled: isAuthed });

  const add = useMutation({
    mutationFn: async (term: string) => {
      if (!isAuthed) return;
      await addSearchHistory(term);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const clear = useMutation({
    mutationFn: () => (isAuthed ? clearSearchHistory() : Promise.resolve()),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, add, clear };
}
