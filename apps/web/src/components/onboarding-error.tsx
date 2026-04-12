type Props = {
  onRetry: () => void;
};

export function OnboardingError({ onRetry }: Props) {
  return (
    <div className="mx-auto mt-14 w-full max-w-xl rounded-2xl border border-border bg-surface/70 p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-soft">Onboarding</p>
      <h1 className="mt-2 text-xl font-semibold text-fg">Unable to load recommendations setup</h1>
      <p className="mt-2 text-sm text-fg-muted">
        We could not load onboarding data from the server. Retry to continue.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 h-10 rounded-lg border border-border-strong px-4 text-sm text-fg hover:border-border-strong"
      >
        Retry
      </button>
    </div>
  );
}
