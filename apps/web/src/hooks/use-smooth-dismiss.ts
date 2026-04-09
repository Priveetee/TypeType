import { useEffect, useRef, useState } from "react";

const CLOSE_MS = 340;

type Params = {
  onClose: () => void;
};

export function useSmoothDismiss({ onClose }: Params) {
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  function dismiss() {
    if (isClosing) return;
    setIsClosing(true);
    timeoutRef.current = window.setTimeout(() => {
      onClose();
    }, CLOSE_MS);
  }

  return { isClosing, dismiss };
}
