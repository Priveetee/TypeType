type Props = {
  message: string | null;
};

export function AuthErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-danger/60 bg-danger/40 px-3 py-2 text-sm text-danger-strong">
      {message}
    </div>
  );
}
