import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchStream } from "../lib/api";
import { mapStreamResponse } from "../lib/mappers";

export function streamQueryOptions(url: string) {
  return queryOptions({
    queryKey: ["stream", url],
    queryFn: () => fetchStream(url).then((r) => mapStreamResponse(r, url)),
    enabled: url.startsWith("http"),
    staleTime: 3 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (count) => count < 4,
    retryDelay: (attempt) => Math.min(250 * 2 ** attempt, 1500),
  });
}

export function useStream(url: string) {
  return useQuery(streamQueryOptions(url));
}
