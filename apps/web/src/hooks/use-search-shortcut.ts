import { useEffect } from "react";

type Params = {
  enabled: boolean;
  onOpen: () => void;
};

export function useSearchShortcut({ enabled, onOpen }: Params) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!enabled) return;
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [enabled, onOpen]);
}
