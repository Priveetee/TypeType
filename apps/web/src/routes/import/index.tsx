import { createFileRoute, Link } from "@tanstack/react-router";

function ImportPage() {
  return (
    <div className="flex flex-col gap-6 pt-10 [animation:page-fade-in_0.2s_ease-out]">
      <div className="px-1 pt-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Migration assistant
        </p>
        <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-zinc-100">
          Import your data in minutes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Pick one source below and we guide you through every step, with clear feedback and
          progress.
        </p>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <ImportSourceLink
          to="/import/youtube"
          title="Import from YouTube"
          description="Bring your subscriptions and playlists using Google Takeout."
          cta="Start YouTube import"
          tone="youtube"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff3d3d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>YouTube import</title>
              <rect x="3" y="6" width="18" height="12" rx="3" />
              <path d="M10 9l5 3-5 3V9z" />
              <path d="M3 12h-1" />
            </svg>
          }
        />
        <ImportSourceLink
          to="/import/pipepipe"
          title="Import from PipePipe"
          description="Restore history, subscriptions, playlists, and watch progress from a backup ZIP."
          cta="Start PipePipe import"
          tone="pipepipe"
          icon={<img src="/pipepipe-logo.png" alt="PipePipe" className="h-6 w-6 rounded-full" />}
        />
      </div>
    </div>
  );
}

type LinkProps = {
  to: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  tone: "youtube" | "pipepipe";
};

function ImportSourceLink({ to, title, description, cta, icon, tone }: LinkProps) {
  const accent =
    tone === "youtube"
      ? "from-red-600/30 to-red-950 border-red-700/40"
      : "from-red-600/25 via-zinc-950 to-zinc-950 border-red-700/40";

  return (
    <Link
      to={to}
      className={`group flex h-full w-full flex-col justify-between rounded-2xl border bg-gradient-to-b p-5 text-left transition-all hover:-translate-y-0.5 ${accent}`}
    >
      <div>
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/45 text-zinc-100">
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
    </Link>
  );
}

export const Route = createFileRoute("/import/")({ component: ImportPage });
