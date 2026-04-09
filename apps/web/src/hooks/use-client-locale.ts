import { useEffect, useState } from "react";

export function useClientLocale() {
  const [locale, setLocale] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setLocale(navigator.language);
  }, []);

  return locale;
}
