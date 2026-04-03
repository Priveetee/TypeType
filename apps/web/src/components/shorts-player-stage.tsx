import { lazy, Suspense } from "react";
import { PageSpinner } from "../components/page-spinner";
import { ShortsActions } from "../components/shorts-actions";
import { ShortsError } from "../components/shorts-error";
import { ShortsInfoOverlay } from "../components/shorts-info-overlay";
import { ShortsNavigation } from "../components/shorts-navigation";
import { ShortsVideoPlayer } from "../components/shorts-video-player";
import { resolveManifestSrc } from "../lib/stream-src";
import type { VideoStream } from "../types/stream";

const ShortsCommentsSheet = lazy(() =>
  import("../components/shorts-comments-sheet").then((module) => ({
    default: module.ShortsCommentsSheet,
  })),
);

type Props = {
  sectionClass: string;
  playerRef: React.RefObject<HTMLDivElement | null>;
  commentsOpen: boolean;
  active: VideoStream;
  current: VideoStream;
  stream: VideoStream | undefined;
  streamLoading: boolean;
  streamError: boolean;
  errorMessage: string;
  isMemberOnlyShort: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  settingsReady: boolean;
  autoplay: boolean;
  initialVolume: number;
  initialMuted: boolean;
  defaultAudioLanguage?: string;
  preferOriginalLanguage?: boolean;
  originalAudioLocale?: string | null;
  defaultSubtitleLanguage?: string;
  subtitlesEnabled?: boolean;
  onOpenComments: () => void;
  onCloseComments: () => void;
  onRetry: () => void;
  onNext: () => void;
  onPrev: () => void;
  onWheel: (event: React.WheelEvent) => void;
  onTouchStart: (clientY: number | null) => void;
  onTouchEnd: (clientY: number | null) => void;
  onVolumeChange: (volume: number, muted: boolean) => void;
};

export function ShortsPlayerStage({
  sectionClass,
  playerRef,
  commentsOpen,
  active,
  current,
  stream,
  streamLoading,
  streamError,
  errorMessage,
  isMemberOnlyShort,
  hasPrev,
  hasNext,
  settingsReady,
  autoplay,
  initialVolume,
  initialMuted,
  defaultAudioLanguage,
  preferOriginalLanguage,
  originalAudioLocale,
  defaultSubtitleLanguage,
  subtitlesEnabled,
  onOpenComments,
  onCloseComments,
  onRetry,
  onNext,
  onPrev,
  onWheel,
  onTouchStart,
  onTouchEnd,
  onVolumeChange,
}: Props) {
  const shouldAutoplay = autoplay && !streamError;
  const playerSrc = stream
    ? resolveManifestSrc(stream, false, false, false, {
        compactAudioTracks: true,
        preferredAudioLanguage: preferOriginalLanguage ? undefined : defaultAudioLanguage,
        preferOriginalLanguage,
        maxCompactAudioTracks: 3,
      })
    : undefined;

  return (
    <section className={sectionClass}>
      <div className="relative flex h-full items-center justify-center">
        <div className="hidden md:absolute md:bottom-3 md:left-0 md:z-20 md:block">
          <ShortsInfoOverlay stream={current} variant="panel" />
        </div>
        <div className="relative flex items-center gap-3 lg:gap-4">
          <div
            ref={playerRef}
            className="shorts-shell relative aspect-[9/16] h-full max-h-[calc(100svh-5.5rem)] w-auto max-w-full overflow-hidden rounded-xl bg-black sm:rounded-2xl md:h-[calc(100svh-6rem)] md:max-h-none"
            onWheel={onWheel}
            onTouchStart={(e) => onTouchStart(e.touches[0]?.clientY ?? null)}
            onTouchEnd={(e) => onTouchEnd(e.changedTouches[0]?.clientY ?? null)}
          >
            {!streamError && streamLoading && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80">
                <PageSpinner fullScreen={false} />
              </div>
            )}
            {streamError && (
              <ShortsError
                message={
                  isMemberOnlyShort ? "This short is only available for members" : errorMessage
                }
                onRetry={onRetry}
                onNext={onNext}
              />
            )}
            {stream && !streamError && playerSrc && (
              <ShortsVideoPlayer
                key={stream.id}
                src={playerSrc}
                title={stream.title}
                poster={stream.thumbnail}
                subtitles={stream.subtitles}
                initialVolume={initialVolume}
                initialMuted={initialMuted}
                settingsReady={settingsReady}
                autoplay={shouldAutoplay}
                defaultAudioLanguage={defaultAudioLanguage}
                preferOriginalLanguage={preferOriginalLanguage}
                originalAudioLocale={originalAudioLocale}
                defaultSubtitleLanguage={defaultSubtitleLanguage}
                subtitlesEnabled={subtitlesEnabled}
                onVolumeChange={onVolumeChange}
                onError={onNext}
                onEnded={onNext}
              />
            )}
            <div className="pointer-events-none md:hidden">
              <ShortsInfoOverlay stream={current} />
            </div>
            <ShortsActions
              stream={current}
              onOpenComments={onOpenComments}
              className="absolute bottom-32 right-2 z-30 md:hidden"
            />
          </div>
          <div className="hidden flex-col items-center gap-3 md:flex">
            <ShortsActions stream={current} onOpenComments={onOpenComments} />
            <ShortsNavigation onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center md:hidden">
          <ShortsNavigation onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} />
        </div>
      </div>
      <Suspense fallback={null}>
        <ShortsCommentsSheet
          videoUrl={active.id}
          anchorEl={playerRef.current}
          open={commentsOpen}
          onClose={onCloseComments}
        />
      </Suspense>
    </section>
  );
}
