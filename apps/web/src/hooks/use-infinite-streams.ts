import { useInfiniteQuery } from "@tanstack/react-query";
import { generateStreams } from "../mocks/streams";
import type { VideoStream } from "../types/stream";

const PAGE_SIZE = 12;
const MAX_PAGES = 5;

type StreamPage = {
  streams: VideoStream[];
  nextPage: number | null;
};

async function fetchPage(page: number): Promise<StreamPage> {
  await new Promise<void>((r) => setTimeout(r, 700));
  return {
    streams: generateStreams(PAGE_SIZE),
    nextPage: page < MAX_PAGES ? page + 1 : null,
  };
}

export function useInfiniteStreams(key: string) {
  return useInfiniteQuery({
    queryKey: ["streams", key],
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage ?? undefined,
  });
}
