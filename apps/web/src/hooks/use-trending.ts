import { useQuery } from "@tanstack/react-query";
import { fetchTrending } from "../lib/api";
import { mapVideoItem } from "../lib/mappers";

export function useTrending(service: number) {
  return useQuery({
    queryKey: ["trending", service],
    queryFn: async () => {
      const items = await fetchTrending(service);
      return items.map(mapVideoItem);
    },
  });
}
