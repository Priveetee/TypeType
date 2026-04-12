import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppTheme = "dark" | "light";

function resolveInitialTheme(): AppTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

type ThemeStore = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "typed-theme";

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: resolveInitialTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
