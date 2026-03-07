import { useQuery } from "@tanstack/react-query";
import { fetchStream } from "../lib/api";
import { mapStreamResponse } from "../lib/mappers";

export function useStream(url: string) {
  return useQuery({
    queryKey: ["stream", url],
    queryFn: () => fetchStream(url).then((r) => mapStreamResponse(r, url)),
    enabled: url.length > 0,
  });
}
