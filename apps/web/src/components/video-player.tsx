import type { MediaProviderAdapter, MediaSrc } from "@vidstack/react";
import { isDASHProvider, MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import * as dashjs from "dashjs";
import { FormatSelector } from "./format-selector";

type Props = {
  src: MediaSrc;
  title?: string;
  poster?: string;
  streamType?: "on-demand" | "live";
};

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (!isDASHProvider(provider)) return;
  provider.library = dashjs.MediaPlayer;
  provider.onInstance((player) => {
    player.updateSettings({ streaming: { cmcd: { enabled: false } } });
  });
}

export function VideoPlayer({ src, title, poster, streamType = "on-demand" }: Props) {
  return (
    <MediaPlayer
      className="w-full dark"
      src={src}
      viewType="video"
      streamType={streamType}
      logLevel="warn"
      crossOrigin
      playsInline
      title={title}
      poster={poster}
      onProviderChange={onProviderChange}
    >
      <MediaProvider />
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        slots={{ playbackMenuItemsEnd: <FormatSelector /> }}
      />
    </MediaPlayer>
  );
}
