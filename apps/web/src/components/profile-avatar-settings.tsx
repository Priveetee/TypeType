import { useMemo, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useAvatar } from "../hooks/use-avatar";
import { getOpenMojiUrl } from "../lib/openmoji";
import { OPENMOJI_CATALOG } from "../lib/openmoji-catalog";
import { Toast } from "./toast";

const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";

function normalizeTerm(value: string): string {
  return value.trim().toLowerCase();
}

export function ProfileAvatarSettings() {
  const { me } = useAuth();
  const { emoji, clear } = useAvatar();
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const busy = emoji.isPending || clear.isPending;

  const filtered = useMemo(() => {
    const term = normalizeTerm(search);
    if (term.length === 0) return OPENMOJI_CATALOG;
    return OPENMOJI_CATALOG.filter((item) => item.label.includes(term) || item.code.includes(term));
  }, [search]);

  if (!me || me.id.startsWith("guest:")) return null;

  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Avatar</p>
      <div className={CARD}>
        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-zinc-100">
              Emojis from{" "}
              <a
                href="https://openmoji.org"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 underline underline-offset-2 hover:text-zinc-100"
              >
                OpenMoji
              </a>
            </p>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search emojis"
              className="h-8 w-40 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-100"
            />
          </div>
          <div className="max-h-52 overflow-y-auto pr-1">
            <div className="grid grid-cols-9 gap-2">
              {filtered.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  disabled={busy}
                  title={`${item.label} (${item.code})`}
                  onClick={() => {
                    emoji.mutate(item.code, {
                      onSuccess: () => setToast("Avatar updated"),
                      onError: () => setToast("Unable to update avatar"),
                    });
                  }}
                  className="h-9 w-9 rounded-md border border-zinc-700 bg-zinc-900 p-1 hover:border-zinc-500 disabled:opacity-50"
                >
                  <img src={getOpenMojiUrl(item.code)} alt={item.label} className="h-full w-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-4 py-4 flex justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              clear.mutate(undefined, {
                onSuccess: () => setToast("Avatar cleared"),
                onError: () => setToast("Unable to clear avatar"),
              });
            }}
            className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs text-zinc-200 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  );
}
