import { useBlocked } from "../hooks/use-blocked";

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";
const ROW = "flex items-center justify-between px-4 py-3 gap-4";

export function SettingsBlocked() {
  const { channels, videos, removeChannel, removeVideo } = useBlocked();

  const channelList = channels.data ?? [];
  const videoList = videos.data ?? [];

  if (channelList.length === 0 && videoList.length === 0) return null;

  return (
    <>
      {channelList.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>Blocked channels</p>
          <div className={CARD}>
            {channelList.map((item) => (
              <div key={item.url} className={ROW}>
                <span className="text-xs text-zinc-400 truncate flex-1 min-w-0">{item.url}</span>
                <button
                  type="button"
                  onClick={() => removeChannel.mutate(item.url)}
                  className="text-xs text-zinc-300 hover:text-zinc-100 transition-colors flex-shrink-0"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {videoList.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className={SECTION_LABEL}>Blocked videos</p>
          <div className={CARD}>
            {videoList.map((item) => (
              <div key={item.url} className={ROW}>
                <span className="text-xs text-zinc-400 truncate flex-1 min-w-0">{item.url}</span>
                <button
                  type="button"
                  onClick={() => removeVideo.mutate(item.url)}
                  className="text-xs text-zinc-300 hover:text-zinc-100 transition-colors flex-shrink-0"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
