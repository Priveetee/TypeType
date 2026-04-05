import { useEffect, useRef, useState } from "react";
import { useAuth } from "./use-auth";

export function useAuthToasts() {
  const [toast, setToast] = useState<string | null>(null);
  const { status } = useAuth();
  const previousStatus = useRef(status);

  useEffect(() => {
    if (previousStatus.current === status) return;
    const from = previousStatus.current;
    previousStatus.current = status;
    if (status === "authenticated" && from !== "loading") {
      setToast("Signed in");
      return;
    }
    if (status === "signed_out" && from !== "loading") {
      setToast("Signed out");
    }
  }, [status]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  return toast;
}
