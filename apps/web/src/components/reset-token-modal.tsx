import { useEffect } from "react";

type ResetTokenModalProps = {
  email: string;
  token: string;
  onClose: () => void;
  onCopied: () => void;
};

export function ResetTokenModal({ email, token, onClose, onCopied }: ResetTokenModalProps) {
  useEffect(() => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        onCopied();
      })
      .catch(() => {});
  }, [token, onCopied]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token).then(() => {
      onCopied();
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="rounded-xl border border-border-strong bg-surface p-6 shadow-2xl max-w-sm w-full mx-4 [animation:modal-fade-in_0.2s_ease-out]"
        role="document"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={() => {}}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-fg">Password Reset Token</h2>
          <p className="text-sm text-fg-muted mt-1">{email}</p>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-app border border-border">
          <p className="text-xs font-mono text-fg break-all">{token}</p>
        </div>

        <div className="mb-3 text-xs text-emerald-200 bg-emerald-950/30 border border-emerald-800/50 p-2 rounded">
          Token copied to clipboard automatically
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 h-9 rounded-md border border-border-strong bg-surface-strong px-3 text-sm font-medium text-fg hover:border-border-strong hover:bg-surface-soft transition-colors"
          >
            Copy token
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-fg hover:border-border-strong hover:bg-surface-strong transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
