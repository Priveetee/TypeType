type Props = {
  message: string;
  onRetry: () => void;
  onNext: () => void;
};

export function ShortsError({ message, onRetry, onNext }: Props) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-5">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <p className="text-sm text-zinc-100">{message}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="h-9 rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-900 hover:bg-white"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onNext}
            className="h-9 rounded-md border border-zinc-600 px-3 text-xs text-zinc-200 hover:border-zinc-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
