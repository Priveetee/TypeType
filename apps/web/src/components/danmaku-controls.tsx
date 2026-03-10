import { useDanmakuStore } from "../stores/danmaku-store";
import { DanmakuIcon } from "./watch-icons";

const BTN = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors";
const BTN_IDLE = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800";
const BTN_ON = "text-zinc-100 bg-zinc-800";
const SLIDER = "w-20 accent-zinc-400 cursor-pointer";

export function DanmakuControls() {
  const { on, speed, size, toggle, setSpeed, setSize } = useDanmakuStore();
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        className={`${BTN} ${on ? BTN_ON : BTN_IDLE}`}
      >
        <DanmakuIcon />
        {on ? "Danmaku on" : "Danmaku"}
      </button>
      {on && (
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <label className="flex items-center gap-1.5">
            Speed
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={SLIDER}
            />
          </label>
          <label className="flex items-center gap-1.5">
            Size
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className={SLIDER}
            />
          </label>
        </div>
      )}
    </div>
  );
}
