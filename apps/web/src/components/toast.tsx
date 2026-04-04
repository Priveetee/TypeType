type Props = { message: string | null };

export function Toast({ message }: Props) {
  if (!message) return null;
  const success = /completed|success|restored|finished/i.test(message);
  const shell = success
    ? "border-emerald-500/40 bg-gradient-to-r from-emerald-600/90 to-emerald-500/80 text-white"
    : "border-zinc-600 bg-zinc-800/95 text-zinc-100";
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[9999] pointer-events-none">
      <div
        key={message}
        className={`rounded-full border px-4 py-2 text-xs shadow-lg backdrop-blur [animation:toast-fade-in_0.2s_ease-out] ${shell}`}
      >
        {message}
      </div>
    </div>
  );
}
