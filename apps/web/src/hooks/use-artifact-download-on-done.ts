import { useCallback, useEffect, useRef, useState } from "react";
import { isMobileDownloadDevice } from "../lib/ios-device";

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException) return error.name === "AbortError";
  if (error instanceof Error) return error.name === "AbortError";
  return false;
}

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
  const isMobile = isMobileDownloadDevice();
  const [isCompleting, setIsCompleting] = useState(false);
  const [awaitingUserAction, setAwaitingUserAction] = useState(false);
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
    setAwaitingUserAction(false);
  }, [isDone]);

  useEffect(() => {
    if (jobId) return;
    handledJobIdRef.current = null;
    setAwaitingUserAction(false);
  }, [jobId]);

  const triggerArtifactOpen = useCallback(async () => {
    setIsCompleting(true);
    setAwaitingUserAction(false);
    onArtifactError(null);
    try {
      await completeDownload(selectedLabel);
    } catch (error) {
      if (isAbortError(error)) {
        setIsCompleting(false);
        setAwaitingUserAction(true);
        return;
      }
      setIsCompleting(false);
      setAwaitingUserAction(true);
      onArtifactError(error instanceof Error ? error.message : "Download failed");
    }
  }, [completeDownload, onArtifactError, selectedLabel]);

  useEffect(() => {
    if (!isDone || !jobId) return;
    if (handledJobIdRef.current === jobId) return;
    handledJobIdRef.current = jobId;
    if (isMobile) {
      setAwaitingUserAction(true);
      return;
    }
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
  }, [completeDownload, isDone, isMobile, jobId, onArtifactError, selectedLabel]);

  return { isCompleting, awaitingUserAction, triggerArtifactOpen };
}
