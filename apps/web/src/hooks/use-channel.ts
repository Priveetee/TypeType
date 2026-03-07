import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChannel } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";
import type { VideoStream } from "../types/stream";

export type ChannelMeta = {
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  subscriberCount: number;
  isVerified: boolean;
};

export type ChannelPage = {
  meta: ChannelMeta | null;
  videos: VideoStream[];
  nextpage: string | null;
};

export function useChannel(channelUrl: string) {
  const query = useInfiniteQuery({
    queryKey: ["channel", channelUrl],
    queryFn: async ({ pageParam }): Promise<ChannelPage> => {
      const res = await fetchChannel(channelUrl, pageParam as string | undefined);
      const isFirstPage = pageParam === undefined;
      return {
        meta: isFirstPage
          ? {
              name: res.name,
              description: res.description,
              avatarUrl: res.avatarUrl,
              bannerUrl: res.bannerUrl,
              subscriberCount: res.subscriberCount,
              isVerified: res.isVerified,
            }
          : null,
        videos: res.videos.map(mapVideoItem),
        nextpage: res.nextpage,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: ChannelPage) => last.nextpage ?? undefined,
    enabled: channelUrl.length > 0,
  });

  const pages = query.data?.pages ?? [];
  const meta = pages.find((p) => p.meta !== null)?.meta ?? null;
  const videos = pages.flatMap((p) => p.videos);

  return { ...query, meta, videos };
}
