import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCommentReplies } from "../lib/api";
import { mapCommentItem } from "../lib/mappers";
import type { Comment } from "../types/comment";

type ReplyPage = {
  comments: Comment[];
  nextpage: string | null;
};

export function useCommentReplies(videoUrl: string, repliesPage: string) {
  return useInfiniteQuery({
    queryKey: ["replies", videoUrl, repliesPage],
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      const res = await fetchCommentReplies(videoUrl, pageParam);
      return {
        comments: res.comments.map(mapCommentItem),
        nextpage: res.nextpage,
      } satisfies ReplyPage;
    },
    initialPageParam: repliesPage,
    getNextPageParam: (last: ReplyPage) => last.nextpage ?? undefined,
    enabled: videoUrl.length > 0,
  });
}
