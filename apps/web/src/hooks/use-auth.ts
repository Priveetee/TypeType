import { useMemo } from "react";
import { useAuthStore } from "../stores/auth-store";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const me = useAuthStore((s) => s.me);
  const status = useAuthStore((s) => s.status);
  const signOut = useAuthStore((s) => s.setSignedOut);

  const role = me?.role ?? null;
  const isAuthed = token !== null;
  const isGuest = status === "guest";
  const isAdmin = role === "admin";
  const isModerator = role === "moderator";
  const canGlobalBlock = useMemo(() => isAdmin || isModerator, [isAdmin, isModerator]);

  return {
    token,
    me,
    role,
    status,
    isAuthed,
    isGuest,
    isAdmin,
    isModerator,
    canGlobalBlock,
    signOut,
  };
}
