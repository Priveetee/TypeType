import { detectProvider } from "../lib/provider";
import type { VideoStream } from "../types/stream";
import { DanmakuControls } from "./danmaku-controls";

type Props = {
  stream: VideoStream;
};

export function WatchCommentActions({ stream }: Props) {
  if (detectProvider(stream.id) !== "bilibili") return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
      <DanmakuControls />
    </div>
  );
}
