import type { VideoStream } from "../types/stream";
import { AutoplayToggle } from "./autoplay-toggle";
import { RelatedCard } from "./related-card";

type Props = {
  streams: VideoStream[];
};

export function RelatedVideos({ streams }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <AutoplayToggle />
      {streams.map((stream) => (
        <RelatedCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
