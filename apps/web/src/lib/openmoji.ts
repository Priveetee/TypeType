import { toApiUrl } from "./env";
import { OPENMOJI_CATALOG } from "./openmoji-catalog";

const OPENMOJI_CODES = OPENMOJI_CATALOG.map((item) => item.code);

function hashSeed(seed: string): number {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return value;
}

export function pickOpenMojiCode(seed: string): string {
  const hash = hashSeed(seed);
  return OPENMOJI_CODES[hash % OPENMOJI_CODES.length];
}

export function getOpenMojiUrl(code: string): string {
  return toApiUrl(`/avatar/openmoji/${code}.svg`);
}
