import type { VideoStream } from "../types/stream";
import { VideoCard } from "./video-card";

type VideoGridProps = {
  streams: VideoStream[];
};

export function VideoGrid({ streams }: VideoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {streams.map((stream) => (
        <VideoCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
