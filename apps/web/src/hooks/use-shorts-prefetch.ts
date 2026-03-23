import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { streamQueryOptions } from "./use-stream";

export function useShortsPrefetch(shortIds: string[], index: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const slowNetwork =
        "connection" in navigator &&
        typeof navigator.connection === "object" &&
        navigator.connection !== null &&
        "saveData" in navigator.connection &&
        navigator.connection.saveData === true;
      if (slowNetwork) return;
    }
    const nextIds = shortIds.slice(index + 1, index + 3);
    for (const id of nextIds) {
      void queryClient.prefetchQuery(streamQueryOptions(id));
    }
  }, [index, queryClient, shortIds]);
}
