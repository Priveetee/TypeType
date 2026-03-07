import { useEffect, useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { Toast } from "../components/toast";
import { useHistoryStore } from "../stores/history-store";
import { useSubscriptionsStore } from "../stores/subscriptions-store";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

type ActiveModal = "history" | "subscriptions" | null;

export function SettingsPrivacy() {
  const entries = useHistoryStore((s) => s.entries);
  const clearEntries = useHistoryStore((s) => s.clearEntries);
  const subscriptions = useSubscriptionsStore((s) => s.subscriptions);
  const unsubscribeAll = useSubscriptionsStore((s) => s.unsubscribeAll);
  const [modal, setModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function handleConfirm() {
    if (modal === "history") {
      clearEntries();
      setToast("Watch history cleared");
    }
    if (modal === "subscriptions") {
      unsubscribeAll();
      setToast("Unsubscribed from all channels");
    }
    setModal(null);
  }

  const historyLabel = entries.length === 1 ? "1 entry" : `${entries.length} entries`;
  const subsLabel = subscriptions.length === 1 ? "1 channel" : `${subscriptions.length} channels`;

  return (
    <section className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>Privacy</p>
      <div className={CARD}>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Watch history</span>
            <span className="text-xs text-zinc-500">{historyLabel}</span>
          </div>
          <button
            type="button"
            disabled={entries.length === 0}
            onClick={() => setModal("history")}
            className="text-xs text-red-400 hover:text-red-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors ml-6 flex-shrink-0"
          >
            Clear
          </button>
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Subscriptions</span>
            <span className="text-xs text-zinc-500">{subsLabel}</span>
          </div>
          <button
            type="button"
            disabled={subscriptions.length === 0}
            onClick={() => setModal("subscriptions")}
            className="text-xs text-red-400 hover:text-red-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors ml-6 flex-shrink-0"
          >
            Unsubscribe all
          </button>
        </div>
      </div>
      {modal !== null && (
        <ConfirmModal
          title={modal === "history" ? `Clear ${historyLabel}?` : `Unsubscribe from ${subsLabel}?`}
          description="This action cannot be undone."
          confirmLabel={modal === "history" ? "Clear" : "Unsubscribe all"}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
      <Toast message={toast} />
    </section>
  );
}
