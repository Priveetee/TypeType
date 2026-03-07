import { useEffect, useState } from "react";
import { Toast } from "../components/toast";
import { useSubscriptionsStore } from "../stores/subscriptions-store";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD = "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden";
const ROW = "flex items-center justify-between px-4 py-4";

export function SettingsData() {
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const [toast, setToast] = useState<string | null>(null);

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
      </div>
      <Toast message={toast} />
    </section>
  );
}
