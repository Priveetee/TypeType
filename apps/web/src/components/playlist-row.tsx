function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Selected"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type RowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export function PlaylistRow({ label, checked, onToggle }: RowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-fg hover:bg-surface-strong hover:text-fg transition-colors"
    >
      <span
        className={`w-4 h-4 flex items-center justify-center rounded border flex-shrink-0 transition-colors ${
          checked ? "bg-fg border-fg text-app" : "border-border-strong"
        }`}
      >
        {checked && <CheckIcon />}
      </span>
      <span className="truncate text-left">{label}</span>
    </button>
  );
}
