const OPENMOJI_CDN = "https://openmoji.org/data/color/svg";

const OPENMOJI_CODES = [
  "1F60A",
  "1F604",
  "1F60E",
  "1F916",
  "1F47D",
  "1F47B",
  "1F680",
  "1F525",
  "2B50",
  "1F31F",
  "1F431",
  "1F436",
  "1F43B",
  "1F984",
  "1F409",
  "1F3AE",
  "1F3B8",
  "1F4BB",
] as const;

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
  return `${OPENMOJI_CDN}/${code}.svg`;
}
