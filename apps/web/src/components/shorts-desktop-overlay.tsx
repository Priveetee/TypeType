import type { VideoStream } from "../types/stream";
import { ShortsActions } from "./shorts-actions";
import { ShortsInfoOverlay } from "./shorts-info-overlay";
import { ShortsNavigation } from "./shorts-navigation";

type Props = {
  stream: VideoStream;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOpenComments: () => void;
};

export function ShortsDesktopOverlay({
  stream,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onOpenComments,
}: Props) {
  return (
    <>
      <div className="hidden md:absolute md:bottom-3 md:left-0 md:z-20 md:block">
        <ShortsInfoOverlay stream={stream} variant="panel" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 ml-[calc(min((100svh-6rem)*0.28125,24rem)+2.25rem)] hidden -translate-y-1/2 md:block md:-translate-x-1/2 lg:ml-[calc(min((100svh-6rem)*0.28125,24rem)+2.75rem)]">
        <ShortsActions
          stream={stream}
          onOpenComments={onOpenComments}
          className="pointer-events-auto"
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 ml-[calc(min((100svh-6rem)*0.28125,24rem)+7.25rem)] hidden -translate-y-1/2 md:block md:-translate-x-1/2 lg:ml-[calc(min((100svh-6rem)*0.28125,24rem)+8rem)]">
        <div className="pointer-events-auto">
          <ShortsNavigation onPrev={onPrev} onNext={onNext} hasPrev={hasPrev} hasNext={hasNext} />
        </div>
      </div>
    </>
  );
}
