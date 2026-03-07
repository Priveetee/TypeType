import type { VideoStream } from "../types/stream";
import { AutoplayToggle } from "./autoplay-toggle";
import { RelatedCard } from "./related-card";
import { RelatedCardSkeleton } from "./related-card-skeleton";

const SKELETON_KEYS = Array.from({ length: 4 }, (_, i) => `rs-${i}`);

type Props = {
  streams: VideoStream[];
  isLoading?: boolean;
};

export function RelatedVideos({ streams, isLoading = false }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <AutoplayToggle />
      {isLoading
        ? SKELETON_KEYS.map((k) => <RelatedCardSkeleton key={k} />)
        : streams.map((stream) => <RelatedCard key={stream.id} stream={stream} />)}
    </div>
  );
}
