import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import { useState } from "react";
import type { QualityStream } from "../types/stream";
import { QualitySelector } from "./quality-selector";

const DEMO_SRC = "https://files.vidstack.io/sprite-fight/720p.mp4";
const DEMO_POSTER = "https://files.vidstack.io/sprite-fight/poster.webp";
const DEMO_TITLE = "Sprite Fight";

function bestStream(streams: QualityStream[]): QualityStream | undefined {
  return streams.filter((s) => !s.isVideoOnly).sort((a, b) => b.bitrate - a.bitrate)[0];
}

type Props = {
  src?: string;
  title?: string;
  poster?: string;
  qualityStreams?: QualityStream[];
};

export function VideoPlayer({
  src = DEMO_SRC,
  title = DEMO_TITLE,
  poster = DEMO_POSTER,
  qualityStreams,
}: Props) {
  const [selected, setSelected] = useState<QualityStream | undefined>(() =>
    qualityStreams ? bestStream(qualityStreams) : undefined,
  );

  const activeSrc = selected?.url ?? src;

  const qualitySlot =
    qualityStreams && qualityStreams.length > 0 && selected ? (
      <QualitySelector streams={qualityStreams} selected={selected} onSelect={setSelected} />
    ) : undefined;

  return (
    <MediaPlayer
      className="w-full"
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
