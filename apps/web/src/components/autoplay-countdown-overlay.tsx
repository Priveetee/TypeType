import { Pause, Play, X } from "lucide-react";
import type { MouseEvent, PointerEvent } from "react";
import type { AutoplayTarget } from "../hooks/use-watch-ended-navigation";
import { proxyImage } from "../lib/proxy";

type Props = {
  target: AutoplayTarget;
  totalSeconds: number;
  paused: boolean;
  onPlayNow: () => void;
  onCancel: () => void;
  onPauseToggle: () => void;
};

export function AutoplayCountdownOverlay({
  target,
  totalSeconds,
  paused,
  onPlayNow,
  onCancel,
  onPauseToggle,
}: Props) {
  const thumbnail = proxyImage(target.thumbnail);
  const progressStyle = {
    animationDuration: `${totalSeconds}s`,
    animationPlayState: paused ? "paused" : "running",
  };
  const pauseButtonClass = paused
    ? "inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-sky-100 ring-1 ring-sky-300/45 transition hover:bg-sky-500/30 hover:ring-sky-200/60"
    : "inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/20 transition hover:bg-black/60 hover:ring-white/35";

  function stopOverlayEvent(event: MouseEvent | PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function stopPointerEvent(event: PointerEvent) {
    event.stopPropagation();
  }

  function handlePlayNow(event: MouseEvent<HTMLButtonElement>) {
    stopOverlayEvent(event);
    onPlayNow();
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>) {
    stopOverlayEvent(event);
    onCancel();
  }

  function handlePauseToggle(event: MouseEvent<HTMLButtonElement>) {
    stopOverlayEvent(event);
    onPauseToggle();
  }

  return (
    <div className="absolute inset-0 z-20 overflow-hidden bg-black text-white">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-75"
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-950" />
      )}
      <div className="absolute inset-0 bg-black/45" />
      <button
        type="button"
        onClick={handleCancel}
        onPointerDown={stopPointerEvent}
        className="absolute right-4 top-4 z-10 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white sm:right-5 sm:top-5"
        aria-label="Cancel autoplay"
      >
        <X className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      </button>
      <div className="relative flex h-full items-end px-4 pb-5 sm:px-7 sm:pb-7">
        <div className="max-w-2xl text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 sm:text-xs">
            Up next
          </p>
          <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-white sm:text-xl lg:text-2xl">
            {target.title}
          </h2>
          {target.channelName && (
            <p className="mt-1.5 text-sm font-medium text-white/65">{target.channelName}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePlayNow}
              onPointerDown={stopPointerEvent}
              className="inline-flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-black/90 hover:ring-white/25"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Play now
            </button>
            <button
              type="button"
              onClick={handlePauseToggle}
              onPointerDown={stopPointerEvent}
              className={pauseButtonClass}
              aria-label={paused ? "Resume autoplay timer" : "Pause autoplay timer"}
            >
              {paused ? (
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              ) : (
                <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-sky-950/55">
        <div
          className="h-full origin-left bg-sky-400 [animation-fill-mode:forwards] [animation-name:autoplay-progress] [animation-timing-function:linear]"
          style={progressStyle}
        />
      </div>
    </div>
  );
}
