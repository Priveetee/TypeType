type Props = {
  message: string | null;
};

export function AuthErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-red-800/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
      {message}
    </div>
  );
}
