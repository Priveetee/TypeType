import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const useRecommendationTrackingStore = create<State>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "recommendation-tracking" },
  ),
);
