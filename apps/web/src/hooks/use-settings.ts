import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings } from "../lib/api-user";
import type { SettingsItem } from "../types/user";

const KEY = ["settings"];

const DEFAULTS: SettingsItem = {
  defaultService: 0,
  defaultQuality: "1080p",
  autoplay: true,
  volume: 1,
  muted: false,
};

export function useSettings() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => fetchSettings(),
    placeholderData: DEFAULTS,
  });

  const update = useMutation({
    mutationFn: (patch: Partial<SettingsItem>) => {
      const current = qc.getQueryData<SettingsItem>(KEY) ?? DEFAULTS;
      const next = { ...current, ...patch };
      return updateSettings(next);
    },
    onSuccess: (data) => {
      qc.setQueryData(KEY, data);
    },
    onError: (err) => {
      console.error("[settings] PUT failed", err);
    },
  });

  return { query, update, settings: query.data ?? DEFAULTS };
}
