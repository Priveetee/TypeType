type Props = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  stateLabel?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function ShortsActionButton({
  icon: Icon,
  label,
  stateLabel,
  active,
  disabled,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 text-white/90 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={label}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
          active
            ? "border-zinc-200/80 bg-zinc-100 text-zinc-900"
            : "border-zinc-700/80 bg-zinc-900/80 hover:border-zinc-500 hover:bg-zinc-800"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-[11px] leading-tight text-white/90">{stateLabel ?? label}</span>
    </button>
  );
}
