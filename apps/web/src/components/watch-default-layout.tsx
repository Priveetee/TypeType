import type { VideoStream } from "../types/stream";
import { RelatedVideos } from "./related-videos";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

type Props = {
  player: React.ReactNode;
  stream: VideoStream;
};

export function WatchDefaultLayout({ player, stream }: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start [animation:page-fade-in_0.2s_ease-out]">
      <div className="min-w-0 flex-[2] max-w-[133.333vh] flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg">{player}</div>
        <WatchInfo stream={stream} />
        <WatchActions stream={stream} />
        {stream.description && <WatchDescription description={stream.description} />}
        <WatchComments key={stream.id} videoUrl={stream.id} />
      </div>
      <div className="w-full lg:flex-1 lg:min-w-64">
        <RelatedVideos streams={stream.related ?? []} />
      </div>
    </div>
  );
}
