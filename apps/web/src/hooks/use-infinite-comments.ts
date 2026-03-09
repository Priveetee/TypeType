import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "../lib/api";
import { mapCommentItem } from "../lib/mappers";
import type { Comment } from "../types/comment";

type CommentPage = {
  comments: Comment[];
  nextpage: string | null;
  commentsDisabled: boolean;
};

export function useInfiniteComments(videoUrl: string) {
  return useInfiniteQuery({
    queryKey: ["comments", videoUrl],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const res = await fetchComments(videoUrl, pageParam);
      return {
        comments: res.comments.map(mapCommentItem),
        nextpage: res.nextpage,
        commentsDisabled: res.commentsDisabled,
      } satisfies CommentPage;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last: CommentPage) => last.nextpage ?? undefined,
    enabled: videoUrl.length > 0,
  });
}
