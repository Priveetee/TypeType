import type { MediaProviderAdapter, MediaSrc } from "@vidstack/react";
import {
  isDASHProvider,
  MediaPlayer,
  MediaProvider,
  Track,
  useMediaRemote,
  useMediaState,
} from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import * as dashjs from "dashjs";
import { useEffect, useRef } from "react";
import type { SponsorBlockSegmentItem, SubtitleItem } from "../types/api";
import { FormatSelector } from "./format-selector";
import { QualitySelector } from "./quality-selector";
import { VolumeRestorer } from "./volume-restorer";

type Props = {
  src: MediaSrc;
  title?: string;
  poster?: string;
  streamType?: "on-demand" | "live";
  startTime?: number;
  subtitles?: SubtitleItem[];
  sponsorBlockSegments?: SponsorBlockSegmentItem[];
  thumbnailVtt?: string;
  initialVolume?: number;
  initialMuted?: boolean;
  settingsReady?: boolean;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onTimeUpdate?: (positionMs: number) => void;
  onPause?: () => void;
  onSeeked?: () => void;
  onError?: () => void;
};

type Dashjsv4Compat = {
  setQualityFor: (type: dashjs.MediaType, index: number, forceReplace?: boolean) => void;
};

function shimDashjsQualityApi(player: dashjs.MediaPlayerClass): void {
  const compat = player as unknown as Dashjsv4Compat;
  compat.setQualityFor = (type, index, forceReplace = false) => {
    player.setRepresentationForTypeByIndex(type, index, forceReplace);
  };
}

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (!isDASHProvider(provider)) return;
  provider.library = dashjs.MediaPlayer;
  provider.onInstance((player) => {
    player.updateSettings({ streaming: { cmcd: { enabled: false } } });
    shimDashjsQualityApi(player);
  });
}

function PlayerSeeker({ startTime }: { startTime: number }) {
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

function SponsorBlockSkipper({ segments }: { segments: SponsorBlockSegmentItem[] }) {
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

export function VideoPlayer({
  src,
  title,
  poster,
  streamType = "on-demand",
  startTime = 0,
  subtitles,
  sponsorBlockSegments,
  thumbnailVtt,
  initialVolume = 1,
  initialMuted = false,
  settingsReady = false,
  onVolumeChange,
  onTimeUpdate,
  onPause,
  onSeeked,
  onError,
}: Props) {
  return (
    <MediaPlayer
      className="w-full dark"
      src={src}
      viewType="video"
      streamType={streamType}
      logLevel="warn"
      crossOrigin
      playsInline
      storage={null}
      title={title}
      poster={poster}
      onProviderChange={onProviderChange}
      onTimeUpdate={({ currentTime }) => onTimeUpdate?.(currentTime * 1000)}
      onPause={() => onPause?.()}
      onSeeked={(currentTime) => {
        onTimeUpdate?.(currentTime * 1000);
        onSeeked?.();
      }}
      onError={() => onError?.()}
    >
      <MediaProvider>
        {subtitles?.map((s) => (
          <Track
            key={s.languageTag}
            kind="subtitles"
            src={s.url}
            label={s.displayLanguageName}
            lang={s.languageTag}
          />
        ))}
      </MediaProvider>
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        thumbnails={thumbnailVtt}
        slots={{
          settingsMenuItemsStart: (
            <>
              <QualitySelector />
              <FormatSelector />
            </>
          ),
        }}
      />
      <PlayerSeeker startTime={startTime} />
      <VolumeRestorer
        initialVolume={initialVolume}
        initialMuted={initialMuted}
        settingsReady={settingsReady}
        onVolumeChange={onVolumeChange}
      />
      {sponsorBlockSegments && <SponsorBlockSkipper segments={sponsorBlockSegments} />}
    </MediaPlayer>
  );
}
