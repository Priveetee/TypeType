import type { MediaSrc } from "@vidstack/react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import type { SubtitleItem } from "../types/api";
import { onProviderChange } from "./video-player-core";

type Props = {
  src: MediaSrc;
  title?: string;
  poster?: string;
  subtitles?: SubtitleItem[];
  initialVolume?: number;
  initialMuted?: boolean;
  settingsReady?: boolean;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onError?: () => void;
  onEnded?: () => void;
};

export function ShortsVideoPlayer({ src, poster, onError, onEnded }: Props) {
  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "black" }}>
      <MediaPlayer
        src={src}
        poster={poster}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        crossOrigin
        playsInline
        storage={null}
        onProviderChange={onProviderChange}
        onError={() => onError?.()}
        onEnded={() => onEnded?.()}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          "--media-object-fit": "cover",
        }}
      >
        <MediaProvider
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          mediaProps={{
            style: {
              position: "absolute",
              inset: "0",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}
        />
      </MediaPlayer>
    </div>
  );
}
