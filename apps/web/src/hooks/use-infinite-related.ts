import { useInfiniteQuery } from "@tanstack/react-query";
import { generateStreams } from "../mocks/streams";
import type { VideoStream } from "../types/stream";

const PAGE_SIZE = 10;
const MAX_PAGES = 8;

type RelatedPage = {
  streams: VideoStream[];
  nextPage: number | null;
};

async function fetchPage(_videoId: string, page: number): Promise<RelatedPage> {
  await new Promise<void>((r) => setTimeout(r, 700));
  return {
    streams: generateStreams(PAGE_SIZE),
    nextPage: page < MAX_PAGES ? page + 1 : null,
  };
}

export function useInfiniteRelated(videoId: string) {
  return useInfiniteQuery({
    queryKey: ["related", videoId],
    queryFn: ({ pageParam }) => fetchPage(videoId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage ?? undefined,
  });
}
