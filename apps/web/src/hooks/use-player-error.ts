import type { MediaSrc } from "@vidstack/react";
import { useCallback, useState } from "react";
import { resolveManifestSrc } from "../lib/stream-src";
import type { VideoStream } from "../types/stream";

type UsePlayerErrorReturn = {
  manifestSrc: MediaSrc;
  playerFailed: boolean;
  handleError: () => void;
};

export function usePlayerError(stream: VideoStream, isLive: boolean): UsePlayerErrorReturn {
  const nativeEnabled = !isLive && Boolean(stream.videoOnlyStreams?.length);
  const [nativeFailed, setNativeFailed] = useState(false);
  const [playerFailed, setPlayerFailed] = useState(false);

  const manifestSrc = resolveManifestSrc(stream, isLive, nativeFailed);

  const handleError = useCallback(() => {
    if (nativeEnabled && !nativeFailed) setNativeFailed(true);
    else setPlayerFailed(true);
  }, [nativeEnabled, nativeFailed]);

  return { manifestSrc, playerFailed, handleError };
}
