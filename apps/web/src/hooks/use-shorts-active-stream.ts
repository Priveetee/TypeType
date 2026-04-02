import { ApiError } from "../lib/api";
import type { VideoStream } from "../types/stream";
import { isMemberOnlyApiError, useStream } from "./use-stream";

type Params = {
  shorts: VideoStream[];
  index: number;
};

export function useShortsActiveStream({ shorts, index }: Params) {
  const active = shorts[index];
  const activeId = active?.id ?? "";
  const streamQuery = useStream(active?.id ?? "");
  const stream = streamQuery.data;
  const current = stream ?? active;
  const errorMessage =
    streamQuery.isError && streamQuery.error instanceof ApiError
      ? streamQuery.error.message
      : "Couldn't load this short.";
  const isMemberOnlyShort = isMemberOnlyApiError(streamQuery.error);

  return {
    active,
    activeId,
    stream,
    streamQuery,
    current,
    errorMessage,
    isMemberOnlyShort,
  };
}
