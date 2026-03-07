import type { MediaSrc } from "@vidstack/react";
import { buildDashManifest } from "../lib/dash-manifest";
import { proxyUrl } from "../lib/proxy";
import type { VideoStream } from "../types/stream";
import { RelatedVideos } from "./related-videos";
import { VideoPlayer } from "./video-player";
import { WatchActions } from "./watch-actions";
import { WatchComments } from "./watch-comments";
import { WatchDescription } from "./watch-description";
import { WatchInfo } from "./watch-info";

const BASE = import.meta.env.VITE_API_URL;

function manifestSrc(stream: VideoStream): MediaSrc {
  if (stream.livestream && stream.hlsUrl) {
    return { src: proxyUrl(stream.hlsUrl), type: "application/x-mpegurl" };
  }
  if (stream.videoOnlyStreams?.length && stream.audioStreams?.length) {
    const src = buildDashManifest(stream.videoOnlyStreams, stream.audioStreams, stream.duration);
    if (src) return { src, type: "application/dash+xml" };
  }
  return {
    src: `${BASE}/streams/manifest?url=${encodeURIComponent(stream.id)}`,
    type: "application/dash+xml",
  };
}

type Props = {
  stream: VideoStream;
};

export function WatchLayout({ stream }: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start [animation:page-fade-in_0.2s_ease-out]">
      <div className="flex-[2] min-w-0 max-w-[133.333vh] flex flex-col gap-4">
        <div className="rounded-lg overflow-hidden">
          <VideoPlayer
            src={manifestSrc(stream)}
            title={stream.title}
            poster={stream.thumbnail}
            streamType={stream.livestream ? "live" : "on-demand"}
          />
        </div>
        <WatchInfo stream={stream} />
        <WatchActions stream={stream} />
        {stream.description && <WatchDescription description={stream.description} />}
        <WatchComments videoUrl={stream.id} />
      </div>
      <div className="w-full lg:flex-1 lg:min-w-64">
        <RelatedVideos streams={stream.related ?? []} />
      </div>
    </div>
  );
}
