import { useCallback, useEffect, useRef, useState } from "react";

type Params = {
  isDone: boolean;
  jobId: string | undefined;
  selectedLabel: string;
  openArtifact: () => Promise<void> | undefined;
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
  onDone,
  onDismiss,
  reset,
  onArtifactError,
}: Params) {
  const [isCompleting, setIsCompleting] = useState(false);
  const handledJobIdRef = useRef<string | null>(null);

  const completeDownload = useCallback(
    async (selected: string) => {
      const run = openArtifact();
      if (!run) throw new Error("Download is not ready");
      await run;
      onDone(`Download started: ${selected}`);
      reset();
      onDismiss();
    },
    [onDismiss, onDone, openArtifact, reset],
  );

  useEffect(() => {
    if (isDone) return;
    setIsCompleting(false);
  }, [isDone]);

  useEffect(() => {
    if (jobId) return;
    handledJobIdRef.current = null;
  }, [jobId]);

  useEffect(() => {
    if (!isDone || !jobId) return;
    if (handledJobIdRef.current === jobId) return;
    handledJobIdRef.current = jobId;
    setIsCompleting(true);
    let cancelled = false;
    const run = async () => {
      try {
        await completeDownload(selectedLabel);
        if (cancelled) return;
      } catch (error) {
        if (cancelled) return;
        setIsCompleting(false);
        onArtifactError(error instanceof Error ? error.message : "Download failed");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [completeDownload, isDone, jobId, onArtifactError, selectedLabel]);

  return { isCompleting };
}
