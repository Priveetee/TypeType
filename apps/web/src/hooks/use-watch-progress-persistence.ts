import { useCallback, useEffect, useRef } from "react";
import { isIosDevice } from "../lib/ios-device";

type MutateFn = (positionMs: number) => void;

type Args = {
  durationSec: number;
  isLive: boolean;
  mutate: MutateFn;
};

export function useWatchProgressPersistence({ durationSec, isLive, mutate }: Args) {
  const positionRef = useRef(0);
  const lastSavedPositionRef = useRef(0);
  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;
  const isIos = isIosDevice();

  const saveRef = useRef<(seeked: boolean) => void>(() => {});
  saveRef.current = (seeked: boolean) => {
    const positionMs = Math.max(0, Math.round(positionRef.current));
    const durationMs = durationSec * 1000;
    if (!Number.isFinite(positionMs) || positionMs <= 0) return;
    if (positionMs >= durationMs * 0.95) return;
    if (positionMs < 5000) return;
    if (!seeked && positionMs < lastSavedPositionRef.current) return;
    lastSavedPositionRef.current = positionMs;
    mutateRef.current(positionMs);
  };

  const handleTimeUpdate = useCallback((positionMs: number) => {
    positionRef.current = positionMs;
  }, []);

  const handlePause = useCallback(() => {
    saveRef.current(false);
  }, []);

  const handleSeeked = useCallback(() => {
    saveRef.current(true);
  }, []);

  useEffect(() => {
    if (isLive) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveRef.current(false);
    };
    const interval = setInterval(() => saveRef.current(false), 10_000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isLive]);

  useEffect(() => {
    if (isLive || !isIos) return;
    const onPageHide = () => {
      saveRef.current(false);
    };
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [isLive, isIos]);

  return {
    positionRef,
    handleTimeUpdate,
    handlePause,
    handleSeeked,
  };
}
