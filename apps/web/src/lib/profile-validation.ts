const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

export function normalizeField(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function validatePublicUsername(value: string | null): string | null {
  if (value === null) return null;
  if (value.length < 3) return "Username must be at least 3 characters.";
  if (value.length > 32) return "Username must be at most 32 characters.";
  if (!USERNAME_REGEX.test(value)) return "Use only letters, numbers, dot, underscore or dash.";
  return null;
}

export function validateBio(value: string | null): string | null {
  if (value === null) return null;
  if (value.length > 280) return "Bio must be at most 280 characters.";
  return null;
}
