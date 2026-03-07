type Props = { message: string | null };

export function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div
        key={message}
        className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-xs px-4 py-2 rounded-full shadow-lg [animation:toast-fade-in_0.2s_ease-out]"
      >
        {message}
      </div>
    </div>
  );
}
