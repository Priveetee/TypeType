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
        active ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}
