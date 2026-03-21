import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageSpinner } from "../components/page-spinner";
import { ShortsVideoPlayer } from "../components/shorts-video-player";
import { useSettings } from "../hooks/use-settings";
import { useShortsFeed } from "../hooks/use-shorts-feed";
import { streamQueryOptions, useStream } from "../hooks/use-stream";
import { useVolumeSync } from "../hooks/use-volume-sync";
import { ApiError } from "../lib/api";
import { useShortsNavigation } from "../lib/shorts-navigation";
import { resolveManifestSrc } from "../lib/stream-src";

export function ShortsPlayerShell() {
  const queryClient = useQueryClient();
  const { shorts, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useShortsFeed();
  const { settings, update, query: settingsQuery } = useSettings();
  const settingsReady =
    (settingsQuery.isSuccess && !settingsQuery.isPlaceholderData) || settingsQuery.isError;
  const { index, moveBy, onWheel, onTouchStart, onTouchEnd } = useShortsNavigation(
    shorts.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  );
  const active = shorts[index];
  const streamQuery = useStream(active?.id ?? "");
  const stream = streamQuery.data;
  const onVolumeChange = useVolumeSync(update.mutate);
  const originalLocale =
    stream?.audioStreams?.find((a) => a.audioTrackName?.toLowerCase().includes("original"))
      ?.audioLocale ?? null;

  useEffect(() => {
    const nextIds = shorts.slice(index + 1, index + 4).map((item) => item.id);
    for (const id of nextIds) {
      void queryClient.prefetchQuery(streamQueryOptions(id));
    }
  }, [index, queryClient, shorts]);

  if (isLoading) return <PageSpinner />;
  if (!active) {
    return (
      <div className="flex items-center justify-center pt-24">
        <p className="text-sm text-zinc-400">No shorts available right now.</p>
      </div>
    );
  }

  const streamErrorMessage =
    streamQuery.isError && streamQuery.error instanceof ApiError
      ? streamQuery.error.message
      : "Couldn't load this short.";

  return (
    <section className="h-[calc(100svh-4.5rem)] overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-[440px] flex-col gap-2 md:max-w-[520px] lg:max-w-[640px] xl:max-w-[720px] 2xl:max-w-[880px]">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <p>
            Shorts {index + 1} / {shorts.length}
          </p>
          {active.channelUrl ? (
            <Link to="/channel" search={{ url: active.channelUrl }} className="hover:text-zinc-200">
              {active.channelName}
            </Link>
          ) : (
            <p>{active.channelName}</p>
          )}
        </div>
        <div
          className="shorts-shell relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 aspect-[9/16] [&_media-player]:h-full [&_media-player]:w-full"
          onWheel={(event) => {
            const target = event.target as HTMLElement;
            const isMenuScrollable =
              target.closest(
                "[role='menu'], [role='menuitem'], [role='option'], .vds-menu-items",
              ) !== null;
            if (!isMenuScrollable) {
              onWheel(event.deltaY);
            }
          }}
          onTouchStart={(event) => {
            onTouchStart(event.touches[0]?.clientY ?? null);
          }}
          onTouchEnd={(event) => {
            onTouchEnd(event.changedTouches[0]?.clientY ?? null);
          }}
        >
          {!streamQuery.isError && streamQuery.isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80">
              <PageSpinner />
            </div>
          )}
          {streamQuery.isError && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-5">
              <div className="flex max-w-sm flex-col items-center gap-3 text-center">
                <p className="text-sm text-zinc-100">{streamErrorMessage}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void streamQuery.refetch();
                    }}
                    className="h-9 rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-900 hover:bg-white"
                  >
                    Retry short
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBy(1)}
                    className="h-9 rounded-md border border-zinc-600 px-3 text-xs text-zinc-200 hover:border-zinc-400"
                  >
                    Next short
                  </button>
                </div>
              </div>
            </div>
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
              onVolumeChange={onVolumeChange}
              onError={() => {
                moveBy(1);
              }}
              onEnded={() => moveBy(1)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
