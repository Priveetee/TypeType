import { useSyncExternalStore } from "react";
import {
  type PlaybackMode,
  readPlaybackMode,
  setPlaybackMode,
  subscribePlaybackMode,
} from "../lib/playback-mode";

export function usePlaybackMode(): {
  playbackMode: PlaybackMode;
  setMode: (next: PlaybackMode) => void;
} {
  const playbackMode = useSyncExternalStore<PlaybackMode>(
    subscribePlaybackMode,
    readPlaybackMode,
    readPlaybackMode,
  );

  return {
    playbackMode,
    setMode: setPlaybackMode,
  };
}
