import { create } from "zustand";
import { persist } from "zustand/middleware";

type DanmakuStore = {
  on: boolean;
  speed: number;
  size: number;
  toggle: () => void;
  setSpeed: (v: number) => void;
  setSize: (v: number) => void;
};

export const useDanmakuStore = create<DanmakuStore>()(
  persist(
    (set) => ({
      on: false,
      speed: 1,
      size: 1,
      toggle: () => set((s) => ({ on: !s.on })),
      setSpeed: (speed) => set({ speed }),
      setSize: (size) => set({ size }),
    }),
    { name: "typed-danmaku" },
  ),
);
