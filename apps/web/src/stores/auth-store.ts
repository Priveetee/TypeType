import { create } from "zustand";
import type { AuthMe, AuthStatus } from "../types/auth";

type StoredAuth = {
  token: string;
  me: AuthMe | null;
};

type AuthStore = {
  token: string | null;
  me: AuthMe | null;
  status: AuthStatus;
  setBootstrapping: () => void;
  setToken: (token: string) => void;
  setSession: (token: string, me: AuthMe) => void;
  setSignedOut: () => void;
};

const STORAGE_KEY = "typed-auth";

function toStatus(me: AuthMe): AuthStatus {
  return me.id.startsWith("guest:") ? "guest" : "authenticated";
}

function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    if (typeof parsed.token !== "string") return null;
    return { token: parsed.token, me: parsed.me ?? null };
  } catch {
    return null;
  }
}

function writeStoredAuth(data: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const stored = readStoredAuth();

export const useAuthStore = create<AuthStore>((set) => ({
  token: stored?.token ?? null,
  me: stored?.me ?? null,
  status:
    stored?.token == null ? "signed_out" : stored.me == null ? "loading" : toStatus(stored.me),
  setBootstrapping: () =>
    set((state) => ({
      ...state,
      status: state.token === null ? "signed_out" : "loading",
    })),
  setToken: (token) => {
    writeStoredAuth({ token, me: null });
    set({ token, me: null, status: "loading" });
  },
  setSession: (token, me) => {
    writeStoredAuth({ token, me });
    set({ token, me, status: toStatus(me) });
  },
  setSignedOut: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, me: null, status: "signed_out" });
  },
}));
