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
              className={`h-1.5 w-14 rounded-full ${
                active || done ? "bg-zinc-200" : "bg-zinc-700"
              }`}
            />
            <span className={`text-xs ${active || done ? "text-zinc-300" : "text-zinc-500"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
