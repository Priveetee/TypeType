type Props = {
  title: string;
  subtitle: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function ImportModalShell({ title, subtitle, open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-3 sm:px-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-zinc-800 bg-zinc-950/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-lg font-semibold text-zinc-100">{title}</p>
            <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-300 hover:text-zinc-100"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
