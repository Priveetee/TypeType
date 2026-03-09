import type { MediaProviderAdapter, MediaSrc } from "@vidstack/react";
import { isDASHProvider, MediaPlayer, MediaProvider, Track, useMediaState } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import * as dashjs from "dashjs";
import type { SponsorBlockSegmentItem, SubtitleItem } from "../types/api";
import { AudioTrackSelector } from "./audio-track-selector";
import { FormatSelector } from "./format-selector";
import { PlayerSeeker, SeekBridge, SponsorBlockSkipper } from "./player-internals";
import { QualitySelector } from "./quality-selector";
import { SponsorBlockBar } from "./sponsorblock-bar";
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
  chaptersVtt?: string;
  initialVolume?: number;
  initialMuted?: boolean;
  settingsReady?: boolean;
  autoplay?: boolean;
  originalAudioLocale?: string | null;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onTimeUpdate?: (positionMs: number) => void;
  onPause?: () => void;
  onSeeked?: () => void;
  onError?: () => void;
  onSeekReady?: (seek: (seconds: number) => void) => void;
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

function ChaptersTrack({ src }: { src: string }) {
  const duration = useMediaState("duration");
  if (!Number.isFinite(duration) || duration <= 0) return null;
  return <Track kind="chapters" src={src} default />;
}

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (!isDASHProvider(provider)) return;
  provider.library = dashjs.MediaPlayer;
  provider.onInstance((player) => {
    player.updateSettings({ streaming: { cmcd: { enabled: false } } });
    shimDashjsQualityApi(player);
  });
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
  chaptersVtt,
  initialVolume = 1,
  initialMuted = false,
  settingsReady = false,
  autoplay = false,
  originalAudioLocale,
  onVolumeChange,
  onTimeUpdate,
  onPause,
  onSeeked,
  onError,
  onSeekReady,
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
        {chaptersVtt && <ChaptersTrack src={chaptersVtt} />}
      </MediaProvider>
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        thumbnails={thumbnailVtt}
        slots={{
          settingsMenuItemsStart: (
            <>
              <AudioTrackSelector originalLocale={originalAudioLocale} />
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
        autoplay={autoplay}
        onVolumeChange={onVolumeChange}
      />
      {sponsorBlockSegments && <SponsorBlockSkipper segments={sponsorBlockSegments} />}
      {sponsorBlockSegments && <SponsorBlockBar segments={sponsorBlockSegments} />}
      {onSeekReady && <SeekBridge onSeekReady={onSeekReady} />}
    </MediaPlayer>
  );
}
