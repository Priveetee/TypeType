import type { VideoStream } from "../types/stream";
import { VideoCard } from "./video-card";

type VideoGridProps = {
  streams: VideoStream[];
};

export function VideoGrid({ streams }: VideoGridProps) {
  const unique = streams.filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {unique.map((stream) => (
        <VideoCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
