import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAdminSettings, updateAdminSettings } from "../lib/api-admin";
import type { AdminSettings } from "../types/admin";

const KEY = ["admin-settings"];

export function useAdminSettings(enabled: boolean) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchAdminSettings,
    enabled,
  });

  const update = useMutation({
    mutationFn: (settings: AdminSettings) => updateAdminSettings(settings),
    onSuccess: (settings) => {
      qc.setQueryData(KEY, settings);
    },
  });

  return { query, update };
}
