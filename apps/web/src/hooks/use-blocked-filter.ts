import type { VideoStream } from "../types/stream";
import { useBlocked } from "./use-blocked";

export function useBlockedFilter() {
  const { channels, videos } = useBlocked();

  const blockedChannelUrls = new Set((channels.data ?? []).map((item) => item.url));
  const blockedVideoUrls = new Set((videos.data ?? []).map((item) => item.url));

  function isBlocked(stream: VideoStream): boolean {
    if (blockedVideoUrls.has(stream.id)) return true;
    if (stream.channelUrl && blockedChannelUrls.has(stream.channelUrl)) return true;
    return false;
  }

  function filter(streams: VideoStream[]): VideoStream[] {
    return streams.filter((s) => !isBlocked(s));
  }

  return { filter, isBlocked, blockedChannelUrls, blockedVideoUrls };
}
