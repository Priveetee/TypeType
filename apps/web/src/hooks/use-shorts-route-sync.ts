import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import type { VideoStream } from "../types/stream";

type Params = {
  targetUrl: string | undefined;
  shorts: VideoStream[];
  index: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  moveTo: (target: number) => void;
  activeId: string;
  onActiveChange: () => void;
};

export function useShortsRouteSync({
  targetUrl,
  shorts,
  index,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  moveTo,
  activeId,
  onActiveChange,
}: Params) {
  const navigate = useNavigate({ from: "/shorts" });
  const syncedTargetRef = useRef<string | null>(null);
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  useEffect(() => {
    if (!targetUrl) return;
    if (syncedTargetRef.current === targetUrl) return;
    syncedTargetRef.current = targetUrl;
    const targetIndex = shorts.findIndex((short) => short.id === targetUrl);
    if (targetIndex >= 0 && targetIndex !== index) moveTo(targetIndex);
    if (targetIndex < 0 && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [targetUrl, shorts, index, moveTo, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (targetUrl) return;
    syncedTargetRef.current = null;
  }, [targetUrl]);

  useEffect(() => {
    const active = shorts[index];
    if (!active) return;
    void navigate({ search: { v: active.id }, replace: true });
  }, [shorts, index, navigate]);

  useEffect(() => {
    if (!activeId) return;
    onActiveChangeRef.current();
  }, [activeId]);
}
