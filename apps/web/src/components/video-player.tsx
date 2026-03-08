import type { MediaProviderAdapter, MediaSrc } from "@vidstack/react";
import { isDASHProvider, MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import * as dashjs from "dashjs";
import { FormatSelector } from "./format-selector";
import { QualitySelector } from "./quality-selector";

type Props = {
  src: MediaSrc;
  title?: string;
  poster?: string;
  streamType?: "on-demand" | "live";
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
        slots={{
          settingsMenuItemsStart: (
            <>
              <QualitySelector />
              <FormatSelector />
            </>
          ),
        }}
      />
    </MediaPlayer>
  );
}
