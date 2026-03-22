import type { MediaSrc } from "@vidstack/react";
import { useCallback, useMemo, useState } from "react";
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

export function usePlayerError(stream: VideoStream, isLive: boolean): UsePlayerErrorReturn {
  const nativeEnabled = !isLive && Boolean(stream.videoOnlyStreams?.length);
  const [nativeFailed, setNativeFailed] = useState(false);
  const [qualityFailed, setQualityFailed] = useState(false);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const manifestSrc = useMemo(
    () => resolveManifestSrc(stream, isLive, nativeFailed, qualityFailed),
    [stream, isLive, nativeFailed, qualityFailed],
  );

  const handleError = useCallback(() => {
    if (nativeEnabled && !nativeFailed) {
      setNativeFailed(true);
    } else if (!qualityFailed) {
      setQualityFailed(true);
      setRetryKey((k) => k + 1);
    } else {
      setPlayerFailed(true);
    }
  }, [nativeEnabled, nativeFailed, qualityFailed]);

  const reset = useCallback(() => {
    setQualityFailed(false);
    setPlayerFailed(false);
    setRetryKey((k) => k + 1);
  }, []);

  return { manifestSrc, playerFailed, qualityFailed, handleError, reset, retryKey };
}
