import type { VideoStream } from "../types/stream";
import { RelatedVideos } from "./related-videos";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

type Props = {
  player: React.ReactNode;
  stream: VideoStream;
  related: VideoStream[];
};

export function WatchCinemaLayout({ player, stream, related }: Props) {
  return (
    <div className="flex flex-col gap-6 [animation:page-fade-in_0.2s_ease-out]">
      <div className="overflow-hidden bg-black">
        <div className="mx-auto h-[min(calc(100vw*9/16),82svh)] w-[min(100vw,calc(82svh*16/9))]">
          {player}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-[2] max-w-[1200px] flex flex-col gap-4">
          <WatchInfo stream={stream} />
          <WatchActions stream={stream} />
          {stream.description && <WatchDescription description={stream.description} />}
          <WatchComments key={stream.id} videoUrl={stream.id} />
        </div>
        <div className="w-full lg:flex-1 lg:min-w-64">
          <RelatedVideos streams={related} />
        </div>
      </div>
    </div>
  );
}
