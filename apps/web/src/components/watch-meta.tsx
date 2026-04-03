import type { VideoStream } from "../types/stream";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

type Props = {
  stream: VideoStream;
};

export function WatchMeta({ stream }: Props) {
  return (
    <>
      <WatchInfo stream={stream} />
      <WatchActions stream={stream} />
      {stream.description && <WatchDescription description={stream.description} />}
      <WatchComments key={stream.id} videoUrl={stream.id} />
    </>
  );
}
