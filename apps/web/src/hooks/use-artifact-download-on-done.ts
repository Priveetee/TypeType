import { useEffect } from "react";

type Params = {
  isDone: boolean;
  jobId: string | undefined;
  selectedLabel: string;
  openArtifact: () => Promise<void> | undefined;
  onDone: (message: string) => void;
  onClose: () => void;
  reset: () => void;
  onArtifactError: (message: string | null) => void;
};

export function useArtifactDownloadOnDone({
  isDone,
  jobId,
  selectedLabel,
  openArtifact,
  onDone,
  onClose,
  reset,
  onArtifactError,
}: Params) {
  useEffect(() => {
    if (!isDone || !jobId) return;
    let cancelled = false;
    const run = async () => {
      try {
        await openArtifact();
        if (cancelled) return;
        onDone(`Download started: ${selectedLabel}`);
        reset();
        onClose();
      } catch (error) {
        if (cancelled) return;
        onArtifactError(error instanceof Error ? error.message : "Download failed");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [isDone, jobId, onArtifactError, onClose, onDone, openArtifact, reset, selectedLabel]);
}
