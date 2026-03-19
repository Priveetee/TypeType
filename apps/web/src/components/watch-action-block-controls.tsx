import { BanIcon } from "./watch-icons";

type Props = {
  canGlobalBlock: boolean;
  channelBlocked: boolean;
  globalBlock: boolean;
  onToggleGlobal: () => void;
  onToggleChannel: () => void;
};

const BTN = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors";
const BTN_IDLE = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800";
const BTN_ON = "text-zinc-100 bg-zinc-800";

export function WatchActionBlockControls({
  canGlobalBlock,
  channelBlocked,
  globalBlock,
  onToggleGlobal,
  onToggleChannel,
}: Props) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleChannel}
        aria-pressed={channelBlocked}
        className={`${BTN} ${channelBlocked ? BTN_ON : BTN_IDLE}`}
      >
        <BanIcon />
        {channelBlocked ? "Unblock channel" : "Block channel"}
      </button>
      {canGlobalBlock && !channelBlocked && (
        <button
          type="button"
          aria-pressed={globalBlock}
          onClick={onToggleGlobal}
          className={`${BTN} ${globalBlock ? BTN_ON : BTN_IDLE}`}
        >
          {globalBlock ? "Global block" : "User block"}
        </button>
      )}
    </>
  );
}
