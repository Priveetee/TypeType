import { ApiError } from "./api";

const PROFILE_ERROR_MESSAGES: Record<string, string> = {
  USERNAME_TAKEN: "This username is already taken.",
  USERNAME_INVALID_FORMAT: "Use only letters, numbers, dot, underscore or dash.",
  USERNAME_INVALID_LENGTH: "Username must be between 3 and 32 characters.",
  BIO_TOO_LONG: "Bio must be at most 280 characters.",
  PROFILE_UPDATE_FAILED: "Unable to update profile.",
};

type ProfileField = "publicUsername" | "bio";

type ProfileServerError = {
  code: string;
  message: string;
  field: ProfileField | null;
};

const FIELD_BY_CODE: Record<string, ProfileField | null> = {
  USERNAME_TAKEN: "publicUsername",
  USERNAME_INVALID_FORMAT: "publicUsername",
  USERNAME_INVALID_LENGTH: "publicUsername",
  BIO_TOO_LONG: "bio",
  PROFILE_UPDATE_FAILED: null,
};

export function parseProfileServerError(error: unknown): ProfileServerError {
  if (error instanceof ApiError) {
    const code = error.message;
    return {
      code,
      message: PROFILE_ERROR_MESSAGES[code] ?? PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_FAILED,
      field: FIELD_BY_CODE[code] ?? null,
    };
  }
  return {
    code: "PROFILE_UPDATE_FAILED",
    message: PROFILE_ERROR_MESSAGES.PROFILE_UPDATE_FAILED,
    field: null,
  };
}
