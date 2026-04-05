import { useEffect, useState } from "react";

const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";
const COARSE_POINTER_QUERY = "(hover: none) and (pointer: coarse)";

function readIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(MOBILE_MEDIA_QUERY).matches || window.matchMedia(COARSE_POINTER_QUERY).matches
  );
}

export function useMobile() {
  const [isMobile, setIsMobile] = useState(readIsMobile);

  useEffect(() => {
    function onResize() {
      setIsMobile(readIsMobile());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}
