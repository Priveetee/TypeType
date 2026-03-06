import { create } from "zustand";

type UiStore = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
