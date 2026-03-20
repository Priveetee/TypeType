import { useAuthStore } from "../stores/auth-store";
import type { AuthMe } from "../types/auth";
import { ApiError } from "./api";
import { fetchMe, loginAuth, refreshAuth, registerAuth } from "./api-auth";

type Credentials = {
  email: string;
  password: string;
};

type RegisterPayload = Credentials & {
  name: string;
};

async function hydrateSession(token: string): Promise<AuthMe> {
  const me = await fetchMe(token);
  useAuthStore.getState().setSession(token, me);
  return me;
}

export async function refreshSession(): Promise<string> {
  const token = useAuthStore.getState().token;
  if (!token) throw new ApiError("Authentication required", 401);
  const refreshed = await refreshAuth(token);
  await hydrateSession(refreshed.token);
  return refreshed.token;
}

export async function bootstrapSession(): Promise<void> {
  const { token, setBootstrapping, setSignedOut } = useAuthStore.getState();
  if (!token) return;
  setBootstrapping();
  try {
    await hydrateSession(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      try {
        await refreshSession();
        return;
      } catch {
        setSignedOut();
        return;
      }
    }
    setSignedOut();
  }
}

export async function loginSession(payload: Credentials): Promise<void> {
  const response = await loginAuth(payload);
  await hydrateSession(response.token);
}

export async function registerSession(payload: RegisterPayload): Promise<void> {
  const response = await registerAuth(payload);
  await hydrateSession(response.token);
}
