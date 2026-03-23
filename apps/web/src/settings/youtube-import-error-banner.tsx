type Props = {
  message: string | null;
};

export function YoutubeImportErrorBanner({ message }: Props) {
  if (!message) return null;

  return (
    <div className="mx-4 mt-4 rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
      {message}
    </div>
  );
}
