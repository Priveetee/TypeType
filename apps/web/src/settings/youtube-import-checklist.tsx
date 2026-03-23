type Props = {
  openedTakeout: boolean;
  hasArchive: boolean;
  isRunning: boolean;
  isCompleted: boolean;
};

function Item({ done, live, label }: { done: boolean; live?: boolean; label: string }) {
  const dotClass = done
    ? "border-zinc-200 bg-zinc-200"
    : live
      ? "border-zinc-500 bg-zinc-700 [animation:pulse_1.2s_ease-in-out_infinite]"
      : "border-zinc-600 bg-transparent";

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className={`inline-flex h-3 w-3 rounded-full border ${dotClass}`} />
      <span className={done ? "text-zinc-300" : "text-zinc-500"}>{label}</span>
    </div>
  );
}

export function YoutubeImportChecklist({
  openedTakeout,
  hasArchive,
  isRunning,
  isCompleted,
}: Props) {
  const stepsDone = Number(openedTakeout) + Number(hasArchive) + Number(isCompleted);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs">
      <p className="mb-2 text-zinc-300">Progress ({stepsDone}/3)</p>
      <div className="space-y-1">
        <Item done={openedTakeout} label="Opened Takeout" />
        <Item done={hasArchive} label="Uploaded ZIP" />
        <Item done={isRunning || isCompleted} live={isRunning} label="Import is running" />
        <Item done={isCompleted} label="Import completed" />
      </div>
    </div>
  );
}
