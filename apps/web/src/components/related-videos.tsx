import type { VideoStream } from "../types/stream";
import { RelatedCard } from "./related-card";

type Props = {
  streams: VideoStream[];
};

export function RelatedVideos({ streams }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {streams.map((stream) => (
        <RelatedCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
