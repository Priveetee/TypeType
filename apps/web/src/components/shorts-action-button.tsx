type Props = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  stateLabel?: string;
  active?: boolean;
  disabled?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

export function ShortsActionButton({
  icon: Icon,
  label,
  stateLabel,
  active,
  disabled,
  compact,
  onClick,
}: Props) {
  const sizeClass = compact ? "h-9 w-9" : "h-12 w-12";
  const iconClass = compact ? "h-4 w-4" : "h-6 w-6";
  const rootClass = compact
    ? "flex flex-col items-center gap-0.5 text-white/90 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    : "flex flex-col items-center gap-1 text-white/90 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={rootClass}
      aria-label={label}
    >
      <div
        className={`flex ${sizeClass} items-center justify-center rounded-full border transition-colors ${
          active
            ? "border-border/80 bg-fg text-app"
            : "border-border-strong/80 bg-surface/80 hover:border-border-strong hover:bg-surface-strong"
        }`}
      >
        <Icon className={iconClass} />
      </div>
      <span
        className={compact ? "sr-only" : "text-[10px] sm:text-[11px] leading-tight text-white/90"}
      >
        {stateLabel ?? label}
      </span>
    </button>
  );
}
