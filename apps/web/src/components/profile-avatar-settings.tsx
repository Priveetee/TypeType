import { useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useAvatar } from "../hooks/use-avatar";
import { getOpenMojiUrl } from "../lib/openmoji";
import { OPENMOJI_CATALOG } from "../lib/openmoji-catalog";
import { Toast } from "./toast";

const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const SCROLL_STEP = 220;

function normalizeTerm(value: string): string {
  return value.trim().toLowerCase();
}

function ArrowIcon({ right }: { right: boolean }) {
  const d = right ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6";
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{right ? "Right arrow" : "Left arrow"}</title>
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProfileAvatarSettings() {
  const { me } = useAuth();
  const { emoji, clear } = useAvatar();
  const listRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const busy = emoji.isPending || clear.isPending;
  const selectedCode = me?.avatarType === "emoji" ? me.avatarCode : null;

  const filtered = useMemo(() => {
    const term = normalizeTerm(search);
    if (term.length === 0) return OPENMOJI_CATALOG;
    return OPENMOJI_CATALOG.filter((item) => item.label.includes(term) || item.code.includes(term));
  }, [search]);

  function scroll(direction: "left" | "right") {
    const next = direction === "right" ? SCROLL_STEP : -SCROLL_STEP;
    listRef.current?.scrollBy({ left: next, behavior: "smooth" });
  }

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
          <div className="flex items-center gap-2 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 p-2">
            <button
              type="button"
              aria-label="Scroll emoji list left"
              disabled={busy}
              onClick={() => scroll("left")}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-50"
            >
              <ArrowIcon right={false} />
            </button>
            <div
              ref={listRef}
              className="min-w-0 flex-1 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-2 py-1">
                {filtered.map((item) => {
                  const selected = selectedCode === item.code;
                  return (
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
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border p-1.5 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
                        selected
                          ? "border-zinc-300 bg-zinc-100/20 ring-1 ring-zinc-300"
                          : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
                      }`}
                    >
                      <img src={getOpenMojiUrl(item.code)} alt={item.label} className="h-7 w-7" />
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              aria-label="Scroll emoji list right"
              disabled={busy}
              onClick={() => scroll("right")}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-50"
            >
              <ArrowIcon right={true} />
            </button>
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
