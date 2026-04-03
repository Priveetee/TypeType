import { useEffect, useRef } from "react";
import {
  useAudioOptions,
  useMediaPlayer,
  useMediaRemote,
  useMediaState,
  useVideoQualityOptions,
} from "../lib/vidstack";
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
  const player = useMediaPlayer();
  const canPlay = useMediaState("canPlay");
  const focused = useRef(false);
  useEffect(() => {
    if (!canPlay || focused.current || !player?.el) return;
    focused.current = true;
    player.el.focus({ preventScroll: true });
  }, [canPlay, player]);
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

type PlayerDefaultsProps = {
  defaultQuality?: string;
  defaultAudioLanguage?: string;
  preferOriginalLanguage?: boolean;
  originalAudioLocale?: string | null;
  subtitlesEnabled?: boolean;
  defaultSubtitleLanguage?: string;
};

export function PlayerDefaults({
  defaultQuality,
  defaultAudioLanguage,
  preferOriginalLanguage,
  originalAudioLocale,
  subtitlesEnabled,
  defaultSubtitleLanguage,
}: PlayerDefaultsProps) {
  const canPlay = useMediaState("canPlay");
  const qualityOptions = useVideoQualityOptions({ sort: "descending" });
  const audioOptions = useAudioOptions();
  const textTracks = useMediaState("textTracks");
  const qualityApplied = useRef(false);
  const audioApplied = useRef(false);
  const subtitleApplied = useRef(false);

  const audioLanguage = preferOriginalLanguage
    ? (originalAudioLocale ?? undefined)
    : defaultAudioLanguage;

  useEffect(() => {
    if (!canPlay || qualityApplied.current || !defaultQuality) return;
    const match = qualityOptions.find((o) => o.label === defaultQuality);
    if (match) {
      match.select();
      qualityApplied.current = true;
    }
  }, [canPlay, qualityOptions, defaultQuality]);

  useEffect(() => {
    if (!canPlay || audioApplied.current || !audioLanguage) return;
    const match = audioOptions.find((o) => o.track.language === audioLanguage);
    if (match) {
      match.select();
      audioApplied.current = true;
    }
  }, [canPlay, audioOptions, audioLanguage]);

  useEffect(() => {
    if (!canPlay || subtitleApplied.current || !subtitlesEnabled) return;
    const count = textTracks.length;
    for (let i = 0; i < count; i++) {
      const track = textTracks[i];
      if (track.kind !== "subtitles" && track.kind !== "captions") continue;
      if (defaultSubtitleLanguage && track.language !== defaultSubtitleLanguage) continue;
      track.setMode("showing");
      subtitleApplied.current = true;
      break;
    }
  }, [canPlay, textTracks, subtitlesEnabled, defaultSubtitleLanguage]);

  return null;
}
