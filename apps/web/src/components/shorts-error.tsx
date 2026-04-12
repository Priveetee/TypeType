type Props = {
  message: string;
  onRetry: () => void;
  onNext: () => void;
};

export function ShortsError({ message, onRetry, onNext }: Props) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-5">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <p className="text-sm text-fg">{message}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="h-9 rounded-md bg-fg px-3 text-xs font-medium text-app hover:bg-white"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onNext}
            className="h-9 rounded-md border border-border-strong px-3 text-xs text-fg hover:border-border-strong"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
