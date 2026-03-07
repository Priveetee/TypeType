import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChannel } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";

export type ChannelPage = {
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  subscriberCount: number;
  isVerified: boolean;
  videos: VideoStream[];
  nextpage: string | null;
};

export function useChannel(channelUrl: string) {
  return useInfiniteQuery({
    queryKey: ["channel", channelUrl],
    queryFn: async ({ pageParam }): Promise<ChannelPage> => {
      const res = await fetchChannel(channelUrl, pageParam as string | undefined);
      return {
        name: res.name,
        description: res.description,
        avatarUrl: res.avatarUrl,
        bannerUrl: res.bannerUrl,
        subscriberCount: res.subscriberCount,
        isVerified: res.isVerified,
        videos: res.videos.map(mapVideoItem),
        nextpage: res.nextpage,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: ChannelPage) => last.nextpage ?? undefined,
    enabled: channelUrl.length > 0,
  });
}
