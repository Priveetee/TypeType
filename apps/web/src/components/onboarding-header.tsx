import { OnboardingProgress } from "./onboarding-progress";

type Props = {
  mode: "onboarding" | "settings";
  step: number;
};

export function OnboardingHeader({ mode, step }: Props) {
  const onboardingMode = mode === "onboarding";

  return (
    <header className="border-b border-zinc-800 pb-5">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">First login</p>
      <h1 className="mt-3 font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
        {onboardingMode ? "Tune your recommendations" : "Recommendation profile"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-zinc-300">
        {onboardingMode
          ? "Quick setup in two steps. You can skip now and fine tune later from settings."
          : "Adjust your interests and channels. Changes apply immediately to recommendation seeding."}
      </p>
      <div className="mt-4">
        <OnboardingProgress currentStep={step} />
      </div>
    </header>
  );
}
