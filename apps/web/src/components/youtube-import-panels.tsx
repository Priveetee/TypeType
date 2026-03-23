import type {
  YoutubeTakeoutImportJob,
  YoutubeTakeoutPreview,
  YoutubeTakeoutReport,
} from "../lib/api-youtube-import";
import { YoutubeImportChecklist } from "../settings/youtube-import-checklist";
import { YoutubeImportDropzone } from "../settings/youtube-import-dropzone";
import { YoutubeImportErrorBanner } from "../settings/youtube-import-error-banner";
import { YoutubeImportGuide } from "../settings/youtube-import-guide";
import { YoutubeImportCookingStage } from "./youtube-import-cooking-stage";
import { YoutubeImportQueueList } from "./youtube-import-queue-list";

type StepTwoProps = {
  disabled: boolean;
  selectedCount: number;
  onFiles: (files: File[]) => void;
  queueFiles: File[];
  currentIndex: number;
  onRemoveFile: (index: number) => void;
  onClearQueue: () => void;
  queueLocked: boolean;
  openedTakeout: boolean;
  hasArchive: boolean;
  isRunning: boolean;
  isCompleted: boolean;
  inlineError: string | null;
};

export function YoutubeImportStepOnePanel({
  onOpenTakeout,
  onHaveZip,
}: {
  onOpenTakeout: () => void;
  onHaveZip: () => void;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-base font-medium text-zinc-100">Step 1: Google Takeout</h3>
      <p className="text-sm text-zinc-500">Open Takeout or skip if you already have ZIP files.</p>
      <YoutubeImportGuide />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenTakeout}
          className="h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-200"
        >
          Open Takeout
        </button>
        <button
          type="button"
          onClick={onHaveZip}
          className="h-9 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs text-zinc-200"
        >
          I already have ZIP files
        </button>
      </div>
    </section>
  );
}

export function YoutubeImportStepTwoPanel({
  disabled,
  selectedCount,
  onFiles,
  queueFiles,
  currentIndex,
  onRemoveFile,
  onClearQueue,
  queueLocked,
  openedTakeout,
  hasArchive,
  isRunning,
  isCompleted,
  inlineError,
}: StepTwoProps) {
  return (
    <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-base font-medium text-zinc-100">Step 2: Import archives</h3>
      <p className="text-sm text-zinc-500">
        Select one or more ZIP files. We import them one by one.
      </p>
      <YoutubeImportDropzone disabled={disabled} onSelectFiles={onFiles} />
      <YoutubeImportQueueList
        files={queueFiles}
        currentIndex={currentIndex}
        locked={queueLocked}
        onRemove={onRemoveFile}
        onClear={onClearQueue}
      />
      {selectedCount > 0 && <p className="text-xs text-zinc-400">Queued files: {selectedCount}</p>}
      <YoutubeImportChecklist
        openedTakeout={openedTakeout}
        hasArchive={hasArchive}
        isRunning={isRunning}
        isCompleted={isCompleted}
      />
      <YoutubeImportErrorBanner message={inlineError} />
    </section>
  );
}

export function YoutubeImportStepThreePanel({
  job,
  preview,
  report,
  inlineError,
}: {
  job: YoutubeTakeoutImportJob | null;
  preview: YoutubeTakeoutPreview | null;
  report: YoutubeTakeoutReport | null;
  inlineError: string | null;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="text-base font-medium text-zinc-100">Step 3: Cooking import</h3>
      <p className="text-sm text-zinc-500">Live progress while we unpack and sync each archive.</p>
      <YoutubeImportCookingStage job={job} preview={preview} report={report} />
      <YoutubeImportErrorBanner message={inlineError} />
    </section>
  );
}
