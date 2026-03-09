import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSettings, updateSettings } from "../lib/api-user";
import type { SettingsItem } from "../types/user";

const KEY = ["settings"];

const DEFAULTS: SettingsItem = { defaultService: 0, defaultQuality: "1080p", autoplay: true };

export function useSettings() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchSettings,
    placeholderData: DEFAULTS,
  });

  const update = useMutation({
    mutationFn: (patch: Partial<SettingsItem>) => {
      const current = qc.getQueryData<SettingsItem>(KEY) ?? DEFAULTS;
      return updateSettings({ ...current, ...patch });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return { query, update, settings: query.data ?? DEFAULTS };
}
