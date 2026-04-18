import { useEffect, useRef } from "react";
import { isIosDevice } from "../lib/ios-device";
import { useMediaPlayer, useMediaRemote, useMediaState } from "../lib/vidstack";
import type { SponsorBlockSegmentItem } from "../types/api";

export function SeekBridge({
  onSeekReady,
}: {
  onSeekReady: (seek: (seconds: number) => void) => void;
}) {
  const remote = useMediaRemote();
  const onSeekReadyRef = useRef(onSeekReady);
  onSeekReadyRef.current = onSeekReady;
  useEffect(() => {
    onSeekReadyRef.current((seconds: number) => remote.seek(seconds));
  }, [remote]);
  return null;
}

export function PlayerFocuser() {
  const ios = isIosDevice();
  const player = useMediaPlayer();
  const canPlay = useMediaState("canPlay");
  const focused = useRef(false);
  useEffect(() => {
    if (ios) return;
    if (!canPlay || focused.current || !player?.el) return;
    focused.current = true;
    player.el.focus({ preventScroll: true });
  }, [ios, canPlay, player]);
  return null;
}

export function PlayerSeeker({ startTime }: { startTime: number }) {
  const remote = useMediaRemote();
  const canPlay = useMediaState("canPlay");
  const seeked = useRef(false);
  useEffect(() => {
    if (canPlay && !seeked.current && startTime > 0) {
      seeked.current = true;
      remote.seek(startTime / 1000);
    }
  }, [canPlay, startTime, remote]);
  return null;
}

export function SponsorBlockSkipper({ segments }: { segments: SponsorBlockSegmentItem[] }) {
  const remote = useMediaRemote();
  const currentTime = useMediaState("currentTime");
  useEffect(() => {
    for (const seg of segments) {
      if (seg.action !== "skip") continue;
      const startSec = seg.startTime / 1000;
      const endSec = seg.endTime / 1000;
      if (currentTime >= startSec && currentTime < endSec) {
        remote.seek(endSec);
        break;
      }
    }
  }, [currentTime, segments, remote]);
  return null;
}
