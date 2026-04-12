type Props = {
  currentStep: number;
};

const STEPS = ["Interests", "Channels"];

export function OnboardingProgress({ currentStep }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STEPS.map((label, index) => {
        const active = index === currentStep;
        const done = index < currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`h-1.5 w-14 rounded-full ${active || done ? "bg-fg" : "bg-surface-soft"}`}
            />
            <span className={`text-xs ${active || done ? "text-fg-muted" : "text-fg-soft"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
