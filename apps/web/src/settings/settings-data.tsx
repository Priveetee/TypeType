import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Toast } from "../components/toast";
import { useSubscriptions } from "../hooks/use-subscriptions";
import type { SubscriptionItem } from "../types/user";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

export function SettingsData() {
  const { query, add } = useSubscriptions();
  const subscriptions = query.data ?? [];
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleExport() {
    const json = JSON.stringify(subscriptions, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "typetype-subscriptions.json";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast("Subscriptions exported");
  }

  function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result !== "string") return;
      let rawParsed: unknown;
      try {
        rawParsed = JSON.parse(result);
      } catch {
        setToast("Import failed: invalid JSON");
        return;
      }
      if (!Array.isArray(rawParsed)) {
        setToast("Import failed: invalid file");
        return;
      }
      const existing = new Set(subscriptions.map((s) => s.channelUrl));
      const items = rawParsed.filter(
        (item): item is Omit<SubscriptionItem, "subscribedAt"> =>
          typeof item === "object" &&
          item !== null &&
          "channelUrl" in item &&
          "name" in item &&
          "avatarUrl" in item,
      );
      const newItems = items.filter((item) => !existing.has(item.channelUrl));
      for (const item of newItems) {
        add.mutate(item);
      }
      setToast(`Imported ${newItems.length} subscription${newItems.length === 1 ? "" : "s"}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const label =
    subscriptions.length === 1 ? "1 subscription" : `${subscriptions.length} subscriptions`;

  return (
    <section className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>Data</p>
      <div className={CARD}>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Export subscriptions</span>
            <span className="text-xs text-zinc-500">{label}</span>
          </div>
          <button
            type="button"
            disabled={subscriptions.length === 0}
            onClick={handleExport}
            className="text-xs text-zinc-300 hover:text-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors ml-6 flex-shrink-0"
          >
            Export
          </button>
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Import subscriptions</span>
            <span className="text-xs text-zinc-500">Load from a JSON file</span>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs text-zinc-300 hover:text-zinc-100 transition-colors ml-6 flex-shrink-0"
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
      </div>
      <Toast message={toast} />
    </section>
  );
}
