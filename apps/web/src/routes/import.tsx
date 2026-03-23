import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ImportModalShell } from "../components/import-modal-shell";
import { ImportSourceCard } from "../components/import-source-card";
import { PipePipeImportModal } from "../components/pipepipe-import-modal";
import { YoutubeImportModal } from "../components/youtube-import-modal";

type Source = "youtube" | "pipepipe" | null;

function ImportPage() {
  const [source, setSource] = useState<Source>(null);

  return (
    <div className="flex flex-col gap-8 [animation:page-fade-in_0.2s_ease-out]">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Migration assistant</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Import your data in minutes</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Pick one source below and we guide you through every step, with clear feedback and
          progress.
        </p>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <ImportSourceCard
          title="Import from YouTube"
          description="Bring your subscriptions and playlists using Google Takeout."
          cta="Start YouTube import"
          tone="youtube"
          onClick={() => setSource("youtube")}
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
        <ImportSourceCard
          title="Import from PipePipe"
          description="Restore history, subscriptions, playlists, and progress from backup."
          cta="Start PipePipe import"
          tone="pipepipe"
          onClick={() => setSource("pipepipe")}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f5a524"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>PipePipe import</title>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h10" />
              <path d="M17 17h3" />
            </svg>
          }
        />
      </div>

      <ImportModalShell
        title="YouTube import"
        subtitle="Step-by-step assistant"
        open={source === "youtube"}
        onClose={() => setSource(null)}
      >
        <YoutubeImportModal onImported={() => {}} />
      </ImportModalShell>

      <ImportModalShell
        title="PipePipe import"
        subtitle="Restore from backup ZIP"
        open={source === "pipepipe"}
        onClose={() => setSource(null)}
      >
        <PipePipeImportModal onImported={() => {}} />
      </ImportModalShell>
    </div>
  );
}

export const Route = createFileRoute("/import")({ component: ImportPage });
