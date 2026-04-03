const UTF8_DECODER = new TextDecoder("utf-8");
const MOJIBAKE_PATTERN = /(Ã.|Â.|â.|Ð.|Ñ.)/;

function looksLikeMojibake(value: string): boolean {
  return MOJIBAKE_PATTERN.test(value);
}

function toLatin1Bytes(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i += 1) {
    bytes[i] = value.charCodeAt(i) & 0xff;
  }
  return bytes;
}

function repairMojibake(value: string): string {
  if (!looksLikeMojibake(value)) return value;
  const decoded = UTF8_DECODER.decode(toLatin1Bytes(value));
  if (decoded.length === 0) return value;
  if (decoded.includes("\ufffd") && !value.includes("\ufffd")) return value;
  return decoded;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function isJsonRecord(value: unknown): value is { [key: string]: JsonValue } {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeJsonValue(value: JsonValue): JsonValue {
  if (typeof value === "string") return repairMojibake(value);
  if (value === null) return null;
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) {
    const normalized: JsonValue[] = [];
    for (const item of value) {
      normalized.push(normalizeJsonValue(item));
    }
    return normalized;
  }
  const normalized: { [key: string]: JsonValue } = {};
  for (const [key, item] of Object.entries(value)) {
    normalized[key] = normalizeJsonValue(item);
  }
  return normalized;
}

export function normalizeApiPayload(value: unknown): unknown {
  if (typeof value === "string") return repairMojibake(value);
  if (Array.isArray(value)) return normalizeJsonValue(value);
  if (isJsonRecord(value)) return normalizeJsonValue(value);
  return value;
}
