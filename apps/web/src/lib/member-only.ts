import { ApiError } from "./api";

export const MEMBER_ONLY_MESSAGE = "This video is only available for members";

export function isMemberOnlyMessage(message: string | null | undefined): boolean {
  if (!message) return false;
  const value = message.toLowerCase();
  return (
    value.includes("only available for members") ||
    value.includes("members-only") ||
    value.includes("member only") ||
    value.includes("requires membership") ||
    value.includes("premium content")
  );
}

export function isMemberOnlyApiError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 400 && isMemberOnlyMessage(error.message);
}
