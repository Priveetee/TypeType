import type { MediaSrc } from "@vidstack/react";
import { useCallback, useState } from "react";
import { resolveManifestSrc } from "../lib/stream-src";
import type { VideoStream } from "../types/stream";

type UsePlayerErrorReturn = {
  manifestSrc: MediaSrc;
  playerFailed: boolean;
  handleError: () => void;
  reset: () => void;
  retryKey: number;
};

export function usePlayerError(stream: VideoStream, isLive: boolean): UsePlayerErrorReturn {
  const nativeEnabled = !isLive && Boolean(stream.videoOnlyStreams?.length);
  const [nativeFailed, setNativeFailed] = useState(false);
  const [playerFailed, setPlayerFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const manifestSrc = resolveManifestSrc(stream, isLive, nativeFailed);

  const handleError = useCallback(() => {
    if (nativeEnabled && !nativeFailed) setNativeFailed(true);
    else setPlayerFailed(true);
  }, [nativeEnabled, nativeFailed]);

  const reset = useCallback(() => {
    setPlayerFailed(false);
    setRetryKey((k) => k + 1);
  }, []);

  return { manifestSrc, playerFailed, handleError, reset, retryKey };
}
