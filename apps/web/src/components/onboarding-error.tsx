type Props = {
  onRetry: () => void;
};

export function OnboardingError({ onRetry }: Props) {
  return (
    <div className="mx-auto mt-14 w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">Onboarding</p>
      <h1 className="mt-2 text-xl font-semibold text-zinc-100">
        Unable to load recommendations setup
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        We could not load onboarding data from the server. Retry to continue.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 h-10 rounded-lg border border-zinc-600 px-4 text-sm text-zinc-200 hover:border-zinc-400"
      >
        Retry
      </button>
    </div>
  );
}
