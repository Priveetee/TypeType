import { useEffect, useRef, useState } from "react";

type ResetTokenModalProps = {
  email: string;
  token: string;
  onClose: () => void;
};

export function ResetTokenModal({ email, token, onClose }: ResetTokenModalProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    navigator.clipboard.writeText(token).catch(() => {});
  }, [token]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="presentation"
    >
      <dialog
        className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl max-w-sm w-full mx-4 [animation:modal-fade-in_0.2s_ease-out]"
        open
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">Password Reset Token</h2>
          <p className="text-sm text-zinc-400 mt-1">{email}</p>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
          <p className="text-xs font-mono text-zinc-200 break-all">{token}</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 h-9 rounded-md border px-3 text-sm font-medium transition-colors ${
              copied
                ? "border-emerald-600 bg-emerald-950/30 text-emerald-200"
                : "border-zinc-600 bg-zinc-800 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-700"
            }`}
          >
            {copied ? "Copied!" : "Copy token"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-9 rounded-md border border-zinc-600 bg-zinc-900 px-3 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}
