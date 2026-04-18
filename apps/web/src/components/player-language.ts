export function normalizeLanguageTag(value: string | null | undefined): string {
  if (!value) return "";
  const [base] = value.toLowerCase().split("-");
  return base ?? "";
}

export function includesOriginal(value: string | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase().includes("original");
}
