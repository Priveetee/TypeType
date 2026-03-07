import { useQueries } from "@tanstack/react-query";
import { fetchChannel } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";
import { useSubscriptionsStore } from "../stores/subscriptions-store";
import type { VideoStream } from "../types/stream";

type Result = {
  streams: VideoStream[];
  isLoading: boolean;
};

export function useSubscriptionFeed(): Result {
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);

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
