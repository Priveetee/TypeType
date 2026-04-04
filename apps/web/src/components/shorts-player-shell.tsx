import { useEffect, useRef, useState } from "react";
import { ShortsPlayerStage } from "../components/shorts-player-stage";
import { ShortsShellLoader } from "../components/shorts-shell-loader";
import { useSettings } from "../hooks/use-settings";
import { useShortsActiveStream } from "../hooks/use-shorts-active-stream";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { useShortsPrefetch } from "../hooks/use-shorts-prefetch";
import { useShortsRouteSync } from "../hooks/use-shorts-route-sync";
import { useVolumeSync } from "../hooks/use-volume-sync";
import { trackShortSkip } from "../lib/recommendation-tracker";
import { useShortsNavigation } from "../lib/shorts-navigation";
import { useUiStore } from "../stores/ui-store";
import type { VideoStream } from "../types/stream";

function findOriginalAudioLocale(stream: VideoStream | undefined): string | null {
  return (
    stream?.audioStreams?.find((track) => track.audioTrackName?.toLowerCase().includes("original"))
      ?.audioLocale ?? null
  );
}

type Props = {
  targetUrl?: string;
};

export function ShortsPlayerShell({ targetUrl }: Props) {
  const { shorts, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useShortsFeed();
  const { settings, update, query: settingsQuery } = useSettings();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const playerRef = useRef<HTMLDivElement>(null);
  const activeEnteredAtRef = useRef<number>(Date.now());
  const activeStreamRef = useRef<Pick<VideoStream, "id" | "channelUrl" | "title"> | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const settingsReady =
    (settingsQuery.isSuccess && !settingsQuery.isPlaceholderData) || settingsQuery.isError;
  const onMove = (delta: number, reason: "user" | "auto") => {
    if (reason !== "user" || delta === 0 || !activeStreamRef.current) return;
    const watchDurationMs = Math.max(0, Date.now() - activeEnteredAtRef.current);
    trackShortSkip(activeStreamRef.current, watchDurationMs);
  };
  const { index, moveBy, moveTo, onWheel, onTouchStart, onTouchEnd } = useShortsNavigation(
    shorts.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    onMove,
  );
  const { active, activeId, stream, streamQuery, current, errorMessage, isMemberOnlyShort } =
    useShortsActiveStream({ shorts, index });
  useEffect(() => {
    if (!active) {
      activeStreamRef.current = null;
      return;
    }
    activeStreamRef.current = {
      id: active.id,
      channelUrl: active.channelUrl,
      title: active.title,
    };
    activeEnteredAtRef.current = Date.now();
  }, [active]);
  const originalAudioLocale = findOriginalAudioLocale(stream);
  const onVolumeChange = useVolumeSync(update.mutate);
  useShortsPrefetch(
    shorts.map((item) => item.id),
    index,
  );

  useShortsRouteSync({
    targetUrl,
    shorts,
    index,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: () => void fetchNextPage(),
    moveTo,
    activeId,
    onActiveChange: () => setCommentsOpen(false),
  });

  const sectionClass = `h-[calc(100svh-4.5rem)] overflow-hidden px-2 pb-2 pt-1 sm:px-4 sm:pb-4 sm:pt-3 ${
    sidebarCollapsed ? "md:pl-16" : "md:pl-52"
  }`;
  if (isLoading) return <ShortsShellLoader sectionClass={sectionClass} />;
  if (!active) {
    return (
      <div className="flex items-center justify-center pt-24">
        <p className="text-sm text-zinc-400">No shorts available right now.</p>
      </div>
    );
  }
  const hasPrev = index > 0;
  const hasNext = index < shorts.length - 1 || hasNextPage;

  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    const isMenu = target.closest("[role='menu'], .vds-menu-items") !== null;
    if (!isMenu) onWheel(e.deltaY);
  };

  return (
    <ShortsPlayerStage
      sectionClass={sectionClass}
      playerRef={playerRef}
      commentsOpen={commentsOpen}
      active={active}
      current={current}
      stream={stream}
      streamLoading={streamQuery.isLoading}
      streamError={streamQuery.isError}
      errorMessage={errorMessage}
      isMemberOnlyShort={isMemberOnlyShort}
      hasPrev={hasPrev}
      hasNext={hasNext}
      settingsReady={settingsReady}
      autoplay={settings.autoplay}
      initialVolume={settings.volume}
      initialMuted={settings.muted}
      defaultAudioLanguage={settings.defaultAudioLanguage || undefined}
      preferOriginalLanguage={settings.preferOriginalLanguage}
      originalAudioLocale={originalAudioLocale}
      defaultSubtitleLanguage={settings.defaultSubtitleLanguage || undefined}
      subtitlesEnabled={settings.subtitlesEnabled}
      onOpenComments={() => setCommentsOpen(true)}
      onCloseComments={() => setCommentsOpen(false)}
      onRetry={() => streamQuery.refetch()}
      onNext={() => moveBy(1, "user")}
      onAutoNext={() => moveBy(1, "auto")}
      onPrev={() => moveBy(-1, "user")}
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onVolumeChange={onVolumeChange}
    />
  );
}
