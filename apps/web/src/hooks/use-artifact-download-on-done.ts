import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!isDone) setIsCompleting(false);
  }, [isDone]);

  useEffect(() => {
    if (!isDone || !jobId) return;
    setIsCompleting(true);
    let cancelled = false;
    const run = async () => {
      try {
        await openArtifact();
        if (cancelled) return;
        onDone(`Download started: ${selectedLabel}`);
        reset();
        onDismiss();
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
  }, [isDone, jobId, onArtifactError, onDismiss, onDone, openArtifact, reset, selectedLabel]);

  return { isCompleting };
}
