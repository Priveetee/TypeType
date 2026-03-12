import { useCallback, useRef } from "react";
import type { SettingsItem } from "../types/user";

type MutateFn = (patch: Partial<SettingsItem>) => void;

export function useVolumeSync(mutate: MutateFn): (volume: number, muted: boolean) => void {
  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback((volume: number, muted: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      mutateRef.current({ volume, muted });
    }, 1000);
  }, []);
}
