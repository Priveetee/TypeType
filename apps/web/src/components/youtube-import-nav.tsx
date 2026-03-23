type Step = 1 | 2 | 3;

type Props = {
  step: Step;
  canPrev: boolean;
  canNext: boolean;
  nextLabel?: string;
  prevLabel?: string;
  onPrev: () => void;
  onNext: () => void;
};

export function YoutubeImportNav({
  step,
  canPrev,
  canNext,
  nextLabel,
  prevLabel,
  onPrev,
  onNext,
}: Props) {
  const fallbackNext = step === 3 ? "Finish" : "Next";

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-600"
      >
        {prevLabel ?? "Previous"}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-200 disabled:cursor-not-allowed disabled:text-zinc-600"
      >
        {nextLabel ?? fallbackNext}
      </button>
    </div>
  );
}
