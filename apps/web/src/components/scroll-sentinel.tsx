import { useEffect, useRef } from "react";

type Props = {
  onIntersect: () => void;
  enabled: boolean;
};

export function ScrollSentinel({ onIntersect, enabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={ref} />;
}
