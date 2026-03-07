import { useQueries } from "@tanstack/react-query";
import { fetchChannel } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";
import { useSubscriptions } from "./use-subscriptions";

type Result = {
  streams: VideoStream[];
  isLoading: boolean;
};

export function useSubscriptionFeed(): Result {
  const { query } = useSubscriptions();
  const subscriptions = query.data ?? [];

  const queries = useQueries({
    queries: subscriptions.map((sub) => ({
      queryKey: ["channel", sub.channelUrl],
      queryFn: async () => {
        const res = await fetchChannel(sub.channelUrl);
        return res.videos.map(mapVideoItem);
      },
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const streams = queries.flatMap((q) => q.data ?? []);

  return { streams, isLoading };
}
