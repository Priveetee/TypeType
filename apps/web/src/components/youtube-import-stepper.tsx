type Step = 1 | 2 | 3;

type Props = {
  step: Step;
  canStep2: boolean;
  canStep3: boolean;
  onSelect: (step: Step) => void;
};

function StepButton({
  n,
  active,
  enabled,
  onClick,
}: {
  n: Step;
  active: boolean;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
        active
          ? "border-zinc-200 bg-zinc-100 text-zinc-900"
          : enabled
            ? "border-zinc-700 bg-zinc-900 text-zinc-200"
            : "border-zinc-800 bg-zinc-950 text-zinc-600"
      }`}
    >
      {n}
    </button>
  );
}

export function YoutubeImportStepper({ step, canStep2, canStep3, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2">
      <StepButton n={1} active={step === 1} enabled={true} onClick={() => onSelect(1)} />
      <StepButton n={2} active={step === 2} enabled={canStep2} onClick={() => onSelect(2)} />
      <StepButton n={3} active={step === 3} enabled={canStep3} onClick={() => onSelect(3)} />
    </div>
  );
}
