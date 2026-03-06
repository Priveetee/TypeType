import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";

export function VideoPlayer() {
  return (
    <MediaPlayer
      src="https://files.vidstack.io/sprite-fight/720p.mp4"
      viewType="video"
      streamType="on-demand"
      logLevel="warn"
      crossOrigin
      playsInline
      title="Sprite Fight"
      poster="https://files.vidstack.io/sprite-fight/poster.webp"
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
      <DefaultVideoLayout
        thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
}
