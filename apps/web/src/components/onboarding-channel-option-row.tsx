type Props = {
  name: string;
  avatarUrl: string;
  fallbackLabel: string;
  active: boolean;
  subtitle?: string;
  onClick: () => void;
};

function initialFromLabel(value: string): string {
  const text = value.trim();
  if (!text) return "?";
  return text[0]?.toUpperCase() ?? "?";
}

export function OnboardingChannelOptionRow({
  name,
  avatarUrl,
  fallbackLabel,
  active,
  subtitle,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 sm:py-2 text-left transition-colors ${
        active
          ? "border-border bg-fg/90 text-app"
          : "border-border-strong text-fg hover:border-border-strong"
      }`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          loading="lazy"
          className="h-8 w-8 rounded-full border border-border-strong object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full border border-border-strong bg-surface text-[11px] font-semibold text-fg-muted grid place-items-center">
          {initialFromLabel(fallbackLabel)}
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm">{name}</span>
        {subtitle && <span className="truncate text-xs text-fg-soft">{subtitle}</span>}
      </div>
    </button>
  );
}
