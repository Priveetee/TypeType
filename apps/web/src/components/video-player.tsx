import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import { useState } from "react";
import type { QualityStream } from "../types/stream";
import { QualitySelector } from "./quality-selector";

type MediaSrc = { src: string; type: string };

function bestStream(streams: QualityStream[]): QualityStream | undefined {
  return streams
    .filter((s) => !s.isVideoOnly)
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];
}

type Props = {
  src?: MediaSrc;
  title?: string;
  poster?: string;
  qualityStreams?: QualityStream[];
};

export function VideoPlayer({ src, title, poster, qualityStreams }: Props) {
  const [selected, setSelected] = useState<QualityStream | undefined>(() =>
    qualityStreams ? bestStream(qualityStreams) : undefined,
  );

  const activeSrc: MediaSrc | undefined = selected ? { src: selected.url, type: "video/mp4" } : src;

  const qualitySlot =
    qualityStreams && qualityStreams.length > 0 && selected ? (
      <QualitySelector streams={qualityStreams} selected={selected} onSelect={setSelected} />
    ) : undefined;

  if (!activeSrc) {
    return (
      <div className="w-full aspect-video bg-zinc-900 flex items-center justify-center rounded-lg">
        <p className="text-zinc-500 text-sm">Stream unavailable</p>
      </div>
    );
  }

  return (
    <MediaPlayer
      className="w-full dark"
      src={activeSrc}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      title={title}
      poster={poster}
    >
      <MediaProvider />
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        slots={{ settingsMenuItemsEnd: qualitySlot }}
      />
    </MediaPlayer>
  );
}
