import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ExternalLinkModal({ url, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onCancel]);

  return createPortal(
    <>
      <div
        role="none"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="external-link-title"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-5 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <p id="external-link-title" className="text-sm font-semibold text-zinc-100">
            You are leaving TypeType
          </p>
          <p className="text-xs text-zinc-400">This link will open in a new tab:</p>
          <p className="text-xs text-zinc-300 break-all font-mono bg-zinc-800 rounded-lg px-2.5 py-2 mt-0.5">
            {url}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3.5 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
