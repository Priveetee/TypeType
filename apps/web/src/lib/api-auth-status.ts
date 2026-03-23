import { ApiError } from "./api";
import { API_BASE as BASE } from "./env";

type RegisterStatus = {
  allowRegistration: boolean;
  bootstrapAvailable: boolean;
};

type ErrorPayload = {
  error?: string;
  message?: string;
};

function isRegisterStatus(value: unknown): value is RegisterStatus {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<RegisterStatus>;
  return (
    typeof record.allowRegistration === "boolean" && typeof record.bootstrapAvailable === "boolean"
  );
}

function readMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const record = payload as ErrorPayload;
  if (typeof record.error === "string" && record.error.length > 0) return record.error;
  if (typeof record.message === "string" && record.message.length > 0) return record.message;
  return fallback;
}

export async function fetchRegisterStatus(): Promise<RegisterStatus> {
  const res = await fetch(`${BASE}/auth/register/status`);
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(readMessage(payload, "Unable to read registration status"), res.status);
  }
  if (!isRegisterStatus(payload)) {
    throw new ApiError("Invalid registration status payload", 500);
  }
  return payload;
}
