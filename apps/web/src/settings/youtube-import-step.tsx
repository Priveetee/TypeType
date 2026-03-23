type Props = {
  number: 1 | 2 | 3;
  title: string;
  description: string;
  cta?: string;
  onCta?: () => void;
  done?: boolean;
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export function YoutubeImportStep({
  number,
  title,
  description,
  cta,
  onCta,
  done,
  active,
  disabled,
  children,
}: Props) {
  const label = done ? "Done" : active ? "Now" : "Next";
  const panelTone = active
    ? "border-zinc-700 bg-zinc-900"
    : done
      ? "border-zinc-800 bg-zinc-900"
      : "border-zinc-900 bg-zinc-950";

  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${panelTone}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 px-2 text-[11px] text-zinc-300">
          {number}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</span>
      </div>
      <p className="text-base font-medium text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      {onCta && cta && (
        <button
          type="button"
          onClick={onCta}
          disabled={disabled}
          className="mt-4 h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-100 transition-colors hover:border-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-600"
        >
          {cta}
        </button>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}
