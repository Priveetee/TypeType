import { useMemo } from "react";
import { generateStreams } from "../mocks/streams";
import { VideoCard } from "./video-card";

export function VideoGrid() {
  const streams = useMemo(() => generateStreams(24), []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {streams.map((stream) => (
        <VideoCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
}
