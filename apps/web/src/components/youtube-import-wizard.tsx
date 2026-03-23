import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";
import { YoutubeImportNav } from "./youtube-import-nav";
import {
  YoutubeImportStepOnePanel,
  YoutubeImportStepThreePanel,
  YoutubeImportStepTwoPanel,
} from "./youtube-import-panels";
import { YoutubeImportStepper } from "./youtube-import-stepper";

type Props = {
  step: 1 | 2 | 3;
  canStep2: boolean;
  canStep3: boolean;
  busy: boolean;
  queuedRemaining: number;
  queueFiles: File[];
  currentIndex: number;
  queueStarted: boolean;
  openedTakeout: boolean;
  hasArchive: boolean;
  running: boolean;
  completed: boolean;
  inlineError: string | null;
  job: YoutubeTakeoutImportJob | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
  onSelectStep: (step: 1 | 2 | 3) => void;
  onOpenTakeout: () => void;
  onHaveZip: () => void;
  onQueueFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearQueue: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function YoutubeImportWizard({
  step,
  canStep2,
  canStep3,
  busy,
  queuedRemaining,
  queueFiles,
  currentIndex,
  queueStarted,
  openedTakeout,
  hasArchive,
  running,
  completed,
  inlineError,
  job,
  preview,
  report,
  onSelectStep,
  onOpenTakeout,
  onHaveZip,
  onQueueFiles,
  onRemoveFile,
  onClearQueue,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="space-y-4">
      <YoutubeImportStepper
        step={step}
        canStep2={canStep2}
        canStep3={canStep3}
        onSelect={onSelectStep}
      />
      {step === 1 && (
        <YoutubeImportStepOnePanel onOpenTakeout={onOpenTakeout} onHaveZip={onHaveZip} />
      )}
      {step === 2 && (
        <YoutubeImportStepTwoPanel
          disabled={busy}
          selectedCount={queuedRemaining}
          queueFiles={queueFiles}
          currentIndex={currentIndex}
          onRemoveFile={onRemoveFile}
          onClearQueue={onClearQueue}
          queueLocked={queueStarted}
          onFiles={onQueueFiles}
          openedTakeout={openedTakeout}
          hasArchive={hasArchive}
          isRunning={running}
          isCompleted={completed}
          inlineError={inlineError}
        />
      )}
      {(step === 3 || running || completed) && (
        <YoutubeImportStepThreePanel
          job={job}
          preview={preview}
          report={report}
          inlineError={inlineError}
        />
      )}
      <YoutubeImportNav
        step={step}
        canPrev={step > 1}
        canNext={
          (step === 1 && canStep2) ||
          (step === 2 && queueFiles.length > 0 && !queueStarted) ||
          (step === 3 && completed)
        }
        nextLabel={
          step === 2
            ? queueStarted
              ? "Running..."
              : "Start queue"
            : step === 3
              ? "Finish"
              : undefined
        }
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}
