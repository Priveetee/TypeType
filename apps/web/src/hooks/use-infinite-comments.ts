import { useInfiniteQuery } from "@tanstack/react-query";
import { generateComments } from "../mocks/comments";
import type { Comment } from "../types/comment";

const PAGE_SIZE = 20;
const MAX_PAGES = 8;

type CommentPage = {
  comments: Comment[];
  nextPage: number | null;
};

async function fetchPage(_videoId: string, page: number): Promise<CommentPage> {
  await new Promise<void>((r) => setTimeout(r, 600));
  return {
    comments: generateComments(PAGE_SIZE),
    nextPage: page < MAX_PAGES ? page + 1 : null,
  };
}

export function useInfiniteComments(videoId: string) {
  return useInfiniteQuery({
    queryKey: ["comments", videoId],
    queryFn: ({ pageParam }) => fetchPage(videoId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage ?? undefined,
  });
}
