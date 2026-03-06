import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiStore = {
  sidebarCollapsed: boolean;
  autoplayEnabled: boolean;
  toggleSidebar: () => void;
  toggleAutoplay: () => void;
};

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      autoplayEnabled: true,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleAutoplay: () => set((state) => ({ autoplayEnabled: !state.autoplayEnabled })),
    }),
    { name: "typed-ui" },
  ),
);
