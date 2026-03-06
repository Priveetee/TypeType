import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";

const DEMO_SRC = "https://files.vidstack.io/sprite-fight/720p.mp4";
const DEMO_POSTER = "https://files.vidstack.io/sprite-fight/poster.webp";
const DEMO_TITLE = "Sprite Fight";
const DEMO_THUMBNAILS = "https://files.vidstack.io/sprite-fight/thumbnails.vtt";

type Props = {
  src?: string;
  title?: string;
  poster?: string;
};

export function VideoPlayer({ src = DEMO_SRC, title = DEMO_TITLE, poster = DEMO_POSTER }: Props) {
  return (
    <MediaPlayer
      className="w-full"
      src={src}
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      title={title}
      poster={poster}
    >
      <MediaProvider>
        <Track
          src="https://files.vidstack.io/sprite-fight/subs/english.vtt"
          kind="subtitles"
          label="English"
          lang="en-US"
          type="vtt"
          default
        />
        <Track
          src="https://files.vidstack.io/sprite-fight/subs/spanish.vtt"
          kind="subtitles"
          label="Spanish"
          lang="es-ES"
          type="vtt"
        />
        <Track
          src="https://files.vidstack.io/sprite-fight/chapters.vtt"
          kind="chapters"
          lang="en-US"
          type="vtt"
          default
        />
      </MediaProvider>
      <DefaultVideoLayout thumbnails={DEMO_THUMBNAILS} icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
