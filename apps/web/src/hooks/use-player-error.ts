import type { MediaSrc } from "@vidstack/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { resolveManifestSrc } from "../lib/stream-src";
import type { VideoStream } from "../types/stream";

type UsePlayerErrorReturn = {
  manifestSrc: MediaSrc;
  playerFailed: boolean;
  qualityFailed: boolean;
  handleError: () => void;
  reset: () => void;
  retryKey: number;
};

function normalizeLanguageTag(value: string | null): string {
  if (value === null || value.length === 0) return "";
  const [base] = value.toLowerCase().split("-");
  return base ?? "";
}

function hasMultipleAudioLanguages(stream: VideoStream): boolean {
  const languages = new Set<string>();
  for (const track of stream.audioStreams ?? []) {
    const language = normalizeLanguageTag(track.audioLocale);
    if (!language) continue;
    languages.add(language);
    if (languages.size > 1) return true;
  }
  return false;
}

export function usePlayerError(stream: VideoStream, isLive: boolean): UsePlayerErrorReturn {
  const streamId = stream.id;
  const preferNativeManifest = !hasMultipleAudioLanguages(stream);
  const nativeEnabled = !isLive && Boolean(stream.videoOnlyStreams?.length) && preferNativeManifest;
  const [nativeFailed, setNativeFailed] = useState(false);
  const [qualityFailed, setQualityFailed] = useState(false);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const manifestSrc = useMemo(
    () =>
      resolveManifestSrc(stream, isLive, nativeFailed, qualityFailed, {
        preferNativeManifest,
      }),
    [stream, isLive, nativeFailed, qualityFailed, preferNativeManifest],
  );

  const handleError = useCallback(() => {
    if (nativeEnabled && !nativeFailed) {
      setNativeFailed(true);
      setRetryKey((k) => k + 1);
    } else if (!qualityFailed) {
      setQualityFailed(true);
      setRetryKey((k) => k + 1);
    } else {
      setPlayerFailed(true);
    }
  }, [nativeEnabled, nativeFailed, qualityFailed]);

  const reset = useCallback(() => {
    setNativeFailed(false);
    setQualityFailed(false);
    setPlayerFailed(false);
    setRetryKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (streamId.length === 0) return;
    setNativeFailed(false);
    setQualityFailed(false);
    setPlayerFailed(false);
    setRetryKey(0);
  }, [streamId]);

  return { manifestSrc, playerFailed, qualityFailed, handleError, reset, retryKey };
}
