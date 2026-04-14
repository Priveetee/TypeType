import { useCallback, useEffect, useRef, useState } from "react";

type Params = {
  isDone: boolean;
  jobId: string | undefined;
  selectedLabel: string;
  openArtifact: (options?: { preferShare?: boolean }) => Promise<void> | undefined;
  autoStart?: boolean;
  preferShare?: boolean;
  onDone: (message: string) => void;
  onDismiss: () => void;
  reset: () => void;
  onArtifactError: (message: string | null) => void;
};

export function useArtifactDownloadOnDone({
  isDone,
  jobId,
  selectedLabel,
  openArtifact,
  autoStart = true,
  preferShare = false,
  onDone,
  onDismiss,
  reset,
  onArtifactError,
}: Params) {
  const [isCompleting, setIsCompleting] = useState(false);
  const handledJobIdRef = useRef<string | null>(null);

  const completeDownload = useCallback(
    async (selected: string, options?: { preferShare?: boolean }) => {
      const run = openArtifact(options);
      if (!run) throw new Error("Download is not ready");
      await run;
      onDone(`Download started: ${selected}`);
      reset();
      onDismiss();
    },
    [onDismiss, onDone, openArtifact, reset],
  );

  const completeNow = useCallback(async () => {
    if (!isDone || !jobId) return;
    if (handledJobIdRef.current === jobId) return;
    handledJobIdRef.current = jobId;
    setIsCompleting(true);
    try {
      await completeDownload(selectedLabel, { preferShare });
    } catch (error) {
      handledJobIdRef.current = null;
      setIsCompleting(false);
      onArtifactError(error instanceof Error ? error.message : "Download failed");
    }
  }, [completeDownload, isDone, jobId, onArtifactError, preferShare, selectedLabel]);

  useEffect(() => {
    if (isDone) return;
    setIsCompleting(false);
  }, [isDone]);

  useEffect(() => {
    if (jobId) return;
    handledJobIdRef.current = null;
  }, [jobId]);

  useEffect(() => {
    if (!autoStart) return;
    if (!isDone || !jobId) return;
    if (handledJobIdRef.current === jobId) return;
    handledJobIdRef.current = jobId;
    setIsCompleting(true);
    let cancelled = false;
    const run = async () => {
      try {
        await completeDownload(selectedLabel, { preferShare });
        if (cancelled) return;
      } catch (error) {
        if (cancelled) return;
        handledJobIdRef.current = null;
        setIsCompleting(false);
        onArtifactError(error instanceof Error ? error.message : "Download failed");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [autoStart, completeDownload, isDone, jobId, onArtifactError, preferShare, selectedLabel]);

  return { isCompleting, completeNow };
}
