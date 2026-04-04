import { useEffect, useState } from "react";

type Props = {
  primarySrc: string;
  secondarySrc: string;
  className: string;
  intervalMs?: number;
};

export function ImportMascotLoop({
  primarySrc,
  secondarySrc,
  className,
  intervalMs = 3600,
}: Props) {
  const [showPrimary, setShowPrimary] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => setShowPrimary((v) => !v), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  const src = showPrimary ? primarySrc : secondarySrc;

  return <video key={src} src={src} autoPlay loop muted playsInline className={className} />;
}
