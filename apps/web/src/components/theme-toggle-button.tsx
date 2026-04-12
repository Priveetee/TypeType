import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../stores/theme-store";

type Props = {
  className?: string;
};

export function ThemeToggleButton({ className }: Props) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-strong text-fg transition-colors duration-200 hover:bg-surface-soft ${className ?? ""}`}
    >
      <span className="relative block h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-200 ${theme === "light" ? "opacity-100" : "opacity-0"}`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-200 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
        />
      </span>
    </button>
  );
}
