import { useEffect, useState } from "react";
import { useYoutubeTakeoutImport } from "../hooks/use-youtube-takeout-import";
import { ApiError } from "../lib/api";
import { applyJobFeedback } from "../settings/youtube-import-helpers";
import { Toast } from "./toast";
import { YoutubeImportWizard } from "./youtube-import-wizard";

const TAKEOUT_URL =
  "https://takeout.google.com/settings/takeout/custom/youtube,my_activity?dest=mail&frequency=once";

type Props = { onImported: () => void };

export function YoutubeImportModal({ onImported }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [openedTakeout, setOpenedTakeout] = useState(false);
  const [hasArchive, setHasArchive] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [completedNotified, setCompletedNotified] = useState(false);
  const [queue, setQueue] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queueStarted, setQueueStarted] = useState(false);
  const imp = useYoutubeTakeoutImport();

  const running = imp.status.data?.status === "running" || imp.status.data?.status === "pending";
  const completed = imp.status.data?.status === "completed";
  const busy = imp.create.isPending || imp.preview.isPending || imp.commit.isPending;

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const job = imp.status.data;
    if (!job) return;
    if (
      (job.status === "running" || job.status === "pending" || job.status === "completed") &&
      step !== 3
    )
      setStep(3);
    const feedback = applyJobFeedback(job);
    setInlineError(feedback.inlineError);
    if (job.status === "completed" && !completedNotified) {
      setCompletedNotified(true);
      void imp.report.mutateAsync(job.jobId);
      onImported();
    }
  }, [completedNotified, imp.report, imp.status.data, onImported, step]);

  useEffect(() => {
    if (!queueStarted || busy || currentIndex >= queue.length) return;
    const file = queue[currentIndex];
    void (async () => {
      setInlineError(null);
      setHasArchive(true);
      try {
        const job = await imp.create.mutateAsync(file);
        const preview = await imp.preview.mutateAsync(job.jobId);
        if ((preview.counts.history ?? 0) > 5000)
          setToast(`Importing ${file.name}: large history detected.`);
        await imp.commit.mutateAsync(job.jobId);
        setCurrentIndex((value) => value + 1);
      } catch (error) {
        setQueueStarted(false);
        if (error instanceof ApiError) {
          setInlineError(error.message);
          setToast(error.message);
          return;
        }
        setInlineError("Unable to process archive.");
        setToast("Unable to process archive.");
      }
    })();
  }, [busy, currentIndex, imp.commit, imp.create, imp.preview, queue, queueStarted]);

  useEffect(() => {
    if (queueStarted || currentIndex < queue.length) return;
    if (queue.length > 0 && currentIndex > 0) setToast("All queued archives processed.");
    setQueueStarted(false);
  }, [currentIndex, queue.length, queueStarted]);

  const canStep2 = openedTakeout || hasArchive || queue.length > 0;
  const canStep3 = queueStarted || Boolean(running) || Boolean(completed);
  const queuedRemaining = Math.max(0, queue.length - currentIndex);

  return (
    <>
      <YoutubeImportWizard
        step={step}
        canStep2={canStep2}
        canStep3={canStep3}
        busy={busy}
        queuedRemaining={queuedRemaining}
        queueFiles={queue}
        currentIndex={currentIndex}
        queueStarted={queueStarted}
        openedTakeout={openedTakeout}
        hasArchive={hasArchive}
        running={Boolean(running)}
        completed={Boolean(completed)}
        inlineError={inlineError}
        job={imp.status.data ?? null}
        preview={imp.flow.preview}
        report={imp.flow.report}
        onSelectStep={setStep}
        onOpenTakeout={() => {
          setOpenedTakeout(true);
          window.open(TAKEOUT_URL, "_blank", "noopener,noreferrer");
        }}
        onHaveZip={() => {
          setOpenedTakeout(true);
          setStep(2);
        }}
        onQueueFiles={(files) => {
          setQueue((prev) => [...prev, ...files]);
          setCurrentIndex(0);
          setQueueStarted(false);
          setHasArchive(true);
          setToast(`${files.length} file(s) added to queue.`);
        }}
        onRemoveFile={(index) => {
          if (queueStarted) return;
          setQueue((prev) => prev.filter((_, i) => i !== index));
          if (currentIndex > index) setCurrentIndex((value) => Math.max(0, value - 1));
          if (queue.length <= 1) setHasArchive(false);
        }}
        onClearQueue={() => {
          if (queueStarted) return;
          setQueue([]);
          setCurrentIndex(0);
          setHasArchive(false);
          setToast("Queue cleared.");
        }}
        onPrev={() => setStep(step === 1 ? 1 : step === 2 ? 1 : 2)}
        onNext={() => {
          if (step === 1 && canStep2) setStep(2);
          if (step === 2 && queue.length > 0) {
            setQueueStarted(true);
            setStep(3);
            setToast("Queue started.");
          }
          if (step === 3 && completed) onImported();
        }}
      />
      <Toast message={toast} />
    </>
  );
}
