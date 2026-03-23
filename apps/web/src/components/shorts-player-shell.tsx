import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { PageSpinner } from "../components/page-spinner";
import { ShortsActions } from "../components/shorts-actions";
import { ShortsDesktopOverlay } from "../components/shorts-desktop-overlay";
import { ShortsError } from "../components/shorts-error";
import { ShortsInfoOverlay } from "../components/shorts-info-overlay";
import { ShortsNavigation } from "../components/shorts-navigation";
import { ShortsShellLoader } from "../components/shorts-shell-loader";
import { ShortsVideoPlayer } from "../components/shorts-video-player";
import { useSettings } from "../hooks/use-settings";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { useShortsPrefetch } from "../hooks/use-shorts-prefetch";
import { useStream } from "../hooks/use-stream";
import { useVolumeSync } from "../hooks/use-volume-sync";
import { ApiError } from "../lib/api";
import { useShortsNavigation } from "../lib/shorts-navigation";
import { resolveManifestSrc } from "../lib/stream-src";
import { useUiStore } from "../stores/ui-store";

const ShortsCommentsSheet = lazy(() =>
  import("../components/shorts-comments-sheet").then((module) => ({
    default: module.ShortsCommentsSheet,
  })),
);

export function ShortsPlayerShell() {
  const { shorts, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useShortsFeed();
  const { settings, update, query: settingsQuery } = useSettings();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const playerRef = useRef<HTMLDivElement>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const settingsReady =
    (settingsQuery.isSuccess && !settingsQuery.isPlaceholderData) || settingsQuery.isError;
  const { index, moveBy, onWheel, onTouchStart, onTouchEnd } = useShortsNavigation(
    shorts.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  );
  const active = shorts[index];
  const activeId = active?.id ?? "";
  const streamQuery = useStream(active?.id ?? "");
  const stream = streamQuery.data;
  const current = stream ?? active;
  const onVolumeChange = useVolumeSync(update.mutate);
  const originalLocale =
    stream?.audioStreams?.find((a) => a.audioTrackName?.toLowerCase().includes("original"))
      ?.audioLocale ?? null;
  useShortsPrefetch(
    shorts.map((item) => item.id),
    index,
  );

  useEffect(() => {
    if (!activeId) return;
    setCommentsOpen(false);
  }, [activeId]);

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
  const errorMessage =
    streamQuery.isError && streamQuery.error instanceof ApiError
      ? streamQuery.error.message
      : "Couldn't load this short.";

  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    const isMenu = target.closest("[role='menu'], .vds-menu-items") !== null;
    if (!isMenu) onWheel(e.deltaY);
  };

  return (
    <section className={sectionClass}>
      <div className="relative h-full w-full">
        {current && (
          <ShortsDesktopOverlay
            stream={current}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrev={() => moveBy(-1)}
            onNext={() => moveBy(1)}
            onOpenComments={() => setCommentsOpen(true)}
          />
        )}
        <div className="relative flex h-full items-center justify-center">
          <div
            ref={playerRef}
            className="shorts-shell relative mx-auto aspect-[9/16] h-full max-h-[calc(100svh-5.5rem)] w-auto max-w-full overflow-hidden rounded-xl bg-black sm:rounded-2xl md:h-[calc(100svh-6rem)] md:max-h-none"
            onWheel={handleWheel}
            onTouchStart={(e) => onTouchStart(e.touches[0]?.clientY ?? null)}
            onTouchEnd={(e) => onTouchEnd(e.changedTouches[0]?.clientY ?? null)}
          >
            {!streamQuery.isError && streamQuery.isLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80">
                <PageSpinner fullScreen={false} />
              </div>
            )}
            {streamQuery.isError && (
              <ShortsError
                message={errorMessage}
                onRetry={() => streamQuery.refetch()}
                onNext={() => moveBy(1)}
              />
            )}
            {stream && !streamQuery.isError && (
              <ShortsVideoPlayer
                key={stream.id}
                src={resolveManifestSrc(stream, false, false, false)}
                title={stream.title}
                poster={stream.thumbnail}
                subtitles={stream.subtitles}
                initialVolume={settings.volume}
                initialMuted={settings.muted}
                settingsReady={settingsReady}
                originalAudioLocale={originalLocale}
                defaultAudioLanguage={settings.defaultAudioLanguage || undefined}
                defaultSubtitleLanguage={settings.defaultSubtitleLanguage || undefined}
                subtitlesEnabled={settings.subtitlesEnabled}
                onVolumeChange={onVolumeChange}
                onError={() => moveBy(1)}
                onEnded={() => {
                  if (settings.autoplay) moveBy(1);
                }}
              />
            )}
            {current && (
              <div className="md:hidden">
                <ShortsInfoOverlay stream={current} />
              </div>
            )}
            {current && (
              <ShortsActions
                stream={current}
                onOpenComments={() => setCommentsOpen(true)}
                className="absolute bottom-32 right-2 z-30 md:hidden"
              />
            )}
          </div>
          <div className="mt-3 flex items-center justify-center md:hidden">
            <ShortsNavigation
              onPrev={() => moveBy(-1)}
              onNext={() => moveBy(1)}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          </div>
        </div>
      </div>
      <Suspense fallback={null}>
        <ShortsCommentsSheet
          videoUrl={active.id}
          anchorEl={playerRef.current}
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
        />
      </Suspense>
    </section>
  );
}
