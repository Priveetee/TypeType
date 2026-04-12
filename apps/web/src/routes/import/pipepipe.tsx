import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ImportRouteHeading } from "../../components/import-route-heading";
import { PipePipeImportCookingState } from "../../components/pipepipe-import-cooking-state";
import { PipePipeImportDropZone } from "../../components/pipepipe-import-drop-zone";
import { PipePipeImportSummary } from "../../components/pipepipe-import-summary";
import { Toast } from "../../components/toast";
import { usePipePipeRestore } from "../../hooks/use-pipepipe-restore";
import { ApiError } from "../../lib/api";
import type { PipePipeRestoreSummary } from "../../lib/api-restore";

function PipePipeImportPage() {
  const { restore } = usePipePipeRestore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<PipePipeRestoreSummary | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  function onFileSelected(file: File) {
    restore.mutate(
      { file, timeMode: "normalized" },
      {
        onSuccess: (result) => {
          setSummary(result);
          setToast("PipePipe import completed.");
        },
        onError: (error) => {
          const msg = error instanceof ApiError ? error.message : "PipePipe import failed.";
          setToast(msg);
        },
      },
    );
  }

  const zoneTone = restore.isPending
    ? "cursor-not-allowed border-border bg-surface text-fg-soft"
    : over
      ? "border-danger-strong bg-surface-strong text-fg"
      : "border-border-strong bg-surface text-fg-muted hover:border-danger";

  return (
    <div className="flex flex-col gap-6 pt-8 sm:pt-12 [animation:page-fade-in_0.2s_ease-out]">
      <Link
        to="/import"
        className="inline-flex w-fit items-center gap-1 text-xs text-fg-soft hover:text-fg-muted"
      >
        <span>←</span> Back to import sources
      </Link>

      <ImportRouteHeading
        label="PipePipe Backup"
        title="Import from PipePipe"
        description="Restore history, subscriptions, playlists, and watch progress from a backup ZIP."
        labelClassName="text-danger-strong/75"
      />

      {summary ? (
        <PipePipeImportSummary summary={summary} />
      ) : restore.isPending ? (
        <PipePipeImportCookingState />
      ) : (
        <PipePipeImportDropZone
          zoneTone={zoneTone}
          disabled={restore.isPending}
          onOver={setOver}
          fileRef={fileRef}
          onFile={onFileSelected}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/import/pipepipe")({ component: PipePipeImportPage });
