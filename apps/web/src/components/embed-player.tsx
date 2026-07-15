import { VideoPlayer } from "./video-player";
import type { VideoPlayerProps } from "./video-player-types";

type Props = VideoPlayerProps & {
  playerKey?: string | number;
  watchUrl?: string;
};

export function EmbedPlayer({ playerKey, watchUrl, ...props }: Props) {
  const overlay =
    props.title && watchUrl ? (
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-2 text-sm text-white/90 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      >
        <span className="truncate">{props.title}</span>
      </a>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black group">
      <VideoPlayer key={playerKey} overlay={overlay} {...props} />
    </div>
  );
}
