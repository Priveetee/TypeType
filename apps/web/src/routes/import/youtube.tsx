import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ImportRouteHeading } from "../../components/import-route-heading";
import { Toast } from "../../components/toast";
import { YoutubeImportCooking } from "../../components/youtube-import-cooking";
import { YoutubeImportDone } from "../../components/youtube-import-done";
import { YoutubeImportDrop } from "../../components/youtube-import-drop";
import { useYoutubeTakeoutImport } from "../../hooks/use-youtube-takeout-import";
import { ApiError } from "../../lib/api";
import { applyJobFeedback } from "../../settings/youtube-import-helpers";

const TAKEOUT_URL =
  "https://takeout.google.com/settings/takeout/custom/youtube,my_activity?dest=mail&frequency=once";

function YoutubeImportPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queueStarted, setQueueStarted] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const reportJobRef = useRef<string | null>(null);
  const reportRetryRef = useRef<number | null>(null);
  const imp = useYoutubeTakeoutImport();

  const running = imp.status.data?.status === "running" || imp.status.data?.status === "pending";
  const completed = imp.status.data?.status === "completed";
  const busy = imp.create.isPending || imp.preview.isPending || imp.commit.isPending;
  const isCooking = running || (queueStarted && currentIndex < queue.length);
  const isDone = completed && currentIndex >= queue.length && !queueStarted;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const job = imp.status.data;
    if (!job) return;
    const feedback = applyJobFeedback(job);
    if (feedback.inlineError !== inlineError) setInlineError(feedback.inlineError);
  }, [imp.status.data, inlineError]);

  useEffect(
    () => () => {
      if (reportRetryRef.current !== null) window.clearTimeout(reportRetryRef.current);
    },
    [],
  );

  useEffect(() => {
    const job = imp.status.data;
    if (!job || job.status !== "completed") return;
    if (imp.flow.report && imp.flow.jobId === job.jobId) return;
    if (reportJobRef.current === job.jobId) return;
    reportJobRef.current = job.jobId;

    const requestReport = async (attempt: number): Promise<void> => {
      try {
        await imp.report.mutateAsync(job.jobId);
        reportRetryRef.current = null;
        setToast("YouTube import completed.");
      } catch (error) {
        if (error instanceof ApiError && error.status === 429 && attempt < 5) {
          const delay = 1200 * (attempt + 1);
          reportRetryRef.current = window.setTimeout(() => {
            void requestReport(attempt + 1);
          }, delay);
          return;
        }
        reportRetryRef.current = null;
        reportJobRef.current = job.jobId;
        const msg = error instanceof ApiError ? error.message : "Unable to load import report.";
        setInlineError(msg);
      }
    };
    void requestReport(0);
  }, [imp.flow.jobId, imp.flow.report, imp.report, imp.status.data]);

  useEffect(() => {
    if (!queueStarted || busy || currentIndex >= queue.length) return;
    const file = queue[currentIndex];
    void (async () => {
      setInlineError(null);
      try {
        const job = await imp.create.mutateAsync(file);
        const preview = await imp.preview.mutateAsync(job.jobId);
        if ((preview.counts.history ?? 0) > 5000) setToast(`Large history in ${file.name}`);
        await imp.commit.mutateAsync(job.jobId);
        setCurrentIndex((v) => v + 1);
      } catch (error) {
        setQueueStarted(false);
        const msg = error instanceof ApiError ? error.message : "Unable to process archive.";
        setInlineError(msg);
        setToast(msg);
      }
    })();
  }, [busy, currentIndex, imp.commit, imp.create, imp.preview, queue, queueStarted]);

  useEffect(() => {
    if (!queueStarted || currentIndex < queue.length) return;
    if (queue.length > 0) setToast("All archives processed.");
    setQueueStarted(false);
  }, [currentIndex, queue.length, queueStarted]);

  return (
    <div className="flex flex-col gap-6 pt-8 sm:pt-12 [animation:page-fade-in_0.2s_ease-out]">
      <Link
        to="/import"
        className="inline-flex w-fit items-center gap-1 text-xs text-fg-soft hover:text-fg-muted"
      >
        <span>←</span> Back to import sources
      </Link>
      <ImportRouteHeading
        label="YouTube Takeout"
        title="Import from YouTube"
        description="Drop your Takeout ZIP below. We import subscriptions, playlists, and history."
      />

      {isCooking ? (
        <YoutubeImportCooking
          job={imp.status.data ?? null}
          preview={imp.flow.preview}
          report={imp.flow.report}
          queueLength={queue.length}
          currentIndex={currentIndex}
        />
      ) : isDone ? (
        <YoutubeImportDone
          job={imp.status.data ?? null}
          preview={imp.flow.preview}
          report={imp.flow.report}
        />
      ) : (
        <YoutubeImportDrop
          queue={queue}
          currentIndex={currentIndex}
          queueStarted={queueStarted}
          busy={busy}
          inlineError={inlineError}
          guideOpen={guideOpen}
          onToggleGuide={() => setGuideOpen((v) => !v)}
          onOpenTakeout={() => window.open(TAKEOUT_URL, "_blank", "noopener,noreferrer")}
          onQueueFiles={(files) => {
            setQueue((prev) => [...prev, ...files]);
            setToast(`${files.length} file(s) queued.`);
          }}
          onRemoveFile={(i) => {
            if (queueStarted) return;
            setQueue((prev) => prev.filter((_, idx) => idx !== i));
          }}
          onClearQueue={() => {
            if (queueStarted) return;
            setQueue([]);
            setCurrentIndex(0);
          }}
          onStart={() => {
            if (queue.length === 0) return;
            setQueueStarted(true);
            setToast("Import started.");
          }}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}

export const Route = createFileRoute("/import/youtube")({ component: YoutubeImportPage });
