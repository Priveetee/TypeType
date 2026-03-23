type Props = {
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  tone: "youtube" | "pipepipe";
  onClick: () => void;
};

export function ImportSourceCard({ title, description, cta, icon, tone, onClick }: Props) {
  const accent =
    tone === "youtube"
      ? "from-red-600/30 to-red-950 border-red-700/40"
      : "from-amber-500/25 to-amber-950 border-amber-700/40";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-full w-full flex-col justify-between rounded-2xl border bg-gradient-to-b p-5 text-left transition-all hover:-translate-y-0.5 ${accent}`}
    >
      <div>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/35 text-zinc-100">
          {icon}
        </div>
        <p className="text-base font-semibold text-zinc-100">{title}</p>
        <p className="mt-1 text-sm text-zinc-300/80">{description}</p>
      </div>
      <div className="mt-5 inline-flex items-center gap-2 text-xs text-zinc-200">
        <span className="inline-flex h-8 items-center rounded-md bg-black/40 px-3 transition-colors group-hover:text-zinc-100">
          {cta}
        </span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </button>
  );
}
