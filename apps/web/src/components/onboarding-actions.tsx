type Props = {
  currentStep: number;
  canNext: boolean;
  canFinish: boolean;
  pending: boolean;
  mode: "onboarding" | "settings";
  onBack: () => void;
  onSkip: () => void;
  onSave: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function OnboardingActions({
  currentStep,
  canNext,
  canFinish,
  pending,
  mode,
  onBack,
  onSkip,
  onSave,
  onNext,
  onFinish,
}: Props) {
  const firstStep = currentStep === 0;
  const lastStep = currentStep === 1;
  const onboardingMode = mode === "onboarding";

  return (
    <footer className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-950/95 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-3 backdrop-blur sm:static sm:bg-transparent sm:pb-0 sm:pt-4">
      <div className="flex items-center gap-4">
        {!firstStep && (
          <button
            type="button"
            onClick={onBack}
            disabled={pending}
            className="h-10 rounded-lg px-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-60"
          >
            Back
          </button>
        )}
        {onboardingMode && (
          <button
            type="button"
            onClick={onSkip}
            disabled={pending}
            className="h-10 rounded-lg px-1 text-sm text-zinc-400 transition-colors hover:text-zinc-200 disabled:opacity-60"
          >
            Skip for now
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="h-10 rounded-lg border border-zinc-600 px-4 text-sm text-zinc-200 disabled:opacity-60"
        >
          {onboardingMode ? "Save" : "Apply"}
        </button>
        {!lastStep && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext || pending}
            className="h-10 rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            Next
          </button>
        )}
        {lastStep && (
          <button
            type="button"
            onClick={onFinish}
            disabled={!canFinish || pending}
            className="h-10 rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-900 disabled:opacity-60"
          >
            Finish
          </button>
        )}
      </div>
    </footer>
  );
}
