type Props = {
  active: boolean;
  onClick: () => void;
  label: string;
};

export function DownloadModeButton({ active, onClick, label }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-2 py-1.5 text-xs transition-colors ${
        active ? "bg-fg text-app" : "bg-surface-strong text-fg-muted hover:bg-surface-soft"
      }`}
    >
      {label}
    </button>
  );
}
