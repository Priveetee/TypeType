import { useCallback, useEffect, useRef } from "react";

type Props = {
  onIntersect: () => void;
  enabled: boolean;
};

export function ScrollSentinel({ onIntersect, enabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const stableOnIntersect = useCallback(onIntersect, [onIntersect]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) stableOnIntersect();
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stableOnIntersect, enabled]);

  return <div ref={ref} />;
}
