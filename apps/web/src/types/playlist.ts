import type { VideoStream } from "./stream";

export type Playlist = {
  id: string;
  name: string;
  streams: VideoStream[];
  createdAt: Date;
};
