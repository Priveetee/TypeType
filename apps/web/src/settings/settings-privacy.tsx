import { useEffect, useState } from "react";
import { ConfirmModal } from "../components/confirm-modal";
import { Toast } from "../components/toast";
import { useHistory } from "../hooks/use-history";
import { useSearchHistory } from "../hooks/use-search-history";
import { useSubscriptions } from "../hooks/use-subscriptions";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-4";

type ActiveModal = "history" | "subscriptions" | "search-history" | null;

export function SettingsPrivacy() {
  const { total: historyTotal, clear: clearHistory } = useHistory();
  const { query: subsQuery, remove: removeSubscription } = useSubscriptions();
  const { total: searchHistoryTotal, clear: clearSearchHistory } = useSearchHistory();
  const subscriptions = subsQuery.data ?? [];
  const [modal, setModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function handleConfirm() {
    if (modal === "history") {
      clearHistory.mutate();
      setToast("Watch history cleared");
    }
    if (modal === "subscriptions") {
      for (const sub of subsQuery.data ?? []) {
        removeSubscription.mutate(sub.channelUrl);
      }
      setToast("Unsubscribed from all channels");
    }
    if (modal === "search-history") {
      clearSearchHistory.mutate();
      setToast("Search history cleared");
    }
    setModal(null);
  }

  const historyLabel = historyTotal === 1 ? "1 entry" : `${historyTotal} entries`;
  const subsLabel = subscriptions.length === 1 ? "1 channel" : `${subscriptions.length} channels`;
  const searchLabel = searchHistoryTotal === 1 ? "1 entry" : `${searchHistoryTotal} entries`;

  const modalTitle =
    modal === "history"
      ? `Clear ${historyLabel}?`
      : modal === "subscriptions"
        ? `Unsubscribe from ${subsLabel}?`
        : `Clear ${searchLabel}?`;
  const confirmLabel =
    modal === "history" ? "Clear" : modal === "subscriptions" ? "Unsubscribe all" : "Clear";

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
            disabled={historyTotal === 0}
            onClick={() => setModal("history")}
            className="text-xs text-red-400 hover:text-red-300 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors ml-6 flex-shrink-0"
          >
            Clear
          </button>
        </div>
        <div className={ROW}>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-zinc-100">Search history</span>
            <span className="text-xs text-zinc-500">{searchLabel}</span>
          </div>
          <button
            type="button"
            disabled={searchHistoryTotal === 0}
            onClick={() => setModal("search-history")}
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
          title={modalTitle}
          description="This action cannot be undone."
          confirmLabel={confirmLabel}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
      <Toast message={toast} />
    </section>
  );
}
