import type { VideoStream } from "../types/stream";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

type Props = {
  stream: VideoStream;
  showComments?: boolean;
};

export function WatchMeta({ stream, showComments = true }: Props) {
  return (
    <>
      <WatchInfo stream={stream} />
      <WatchActions stream={stream} />
      {stream.description && <WatchDescription description={stream.description} />}
      {showComments && <WatchComments key={stream.id} videoUrl={stream.id} />}
    </>
  );
}
