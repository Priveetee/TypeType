import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBugReport } from "../hooks/use-bug-report";
import type { BugReportCategory, PlayerStateContext } from "../types/bug-report";

type Props = {
  videoUrl?: string | null;
  playerState?: PlayerStateContext | null;
  onClose: () => void;
};

const CATEGORIES: { value: BugReportCategory; label: string }[] = [
  { value: "player", label: "Player" },
  { value: "audio_language", label: "Audio Language" },
  { value: "subtitles", label: "Subtitles" },
  { value: "ui", label: "Interface" },
  { value: "functionality", label: "Functionality" },
];

export function ReportBugModal({ videoUrl, playerState, onClose }: Props) {
  const [category, setCategory] = useState<BugReportCategory>("player");
  const [description, setDescription] = useState("");
  const mutation = useBugReport();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (description.trim().length === 0) return;
    mutation.mutate(
      { category, description: description.trim(), videoUrl, playerState },
      { onSuccess: onClose },
    );
  }

  const isSubmitting = mutation.isPending;
  const hasError = mutation.isError;

  return createPortal(
    <>
      <div
        role="none"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-bug-title"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[calc(100vw-2rem)] bg-surface border border-border-strong rounded-xl shadow-2xl p-5 flex flex-col gap-4"
      >
        <p id="report-bug-title" className="text-sm font-semibold text-fg">
          Report a Bug
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bug-category" className="text-xs text-fg-muted">
              Category
            </label>
            <select
              id="bug-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BugReportCategory)}
              className="w-full px-3 py-2 text-sm bg-surface-strong border border-border-strong rounded-lg text-fg focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bug-description" className="text-xs text-fg-muted">
              Description
            </label>
            <textarea
              id="bug-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-surface-strong border border-border-strong rounded-lg text-fg placeholder:text-fg-soft resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {hasError && (
            <p className="text-xs text-danger">Failed to submit report. Please try again.</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-sm text-fg-muted hover:text-fg bg-surface-strong hover:bg-surface-soft rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || description.trim().length === 0}
              className="px-3.5 py-1.5 text-sm text-white bg-accent hover:bg-accent-strong rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body,
  );
}
