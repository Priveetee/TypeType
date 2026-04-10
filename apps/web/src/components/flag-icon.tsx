function toFlagEmoji(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;
  const first = normalized.codePointAt(0);
  const second = normalized.codePointAt(1);
  if (first === undefined || second === undefined) return null;
  const base = 127397;
  return String.fromCodePoint(first + base, second + base);
}

type FlagIconProps = {
  code: string;
  className?: string;
};

export function FlagIcon({ code, className }: FlagIconProps) {
  const flag = toFlagEmoji(code);
  if (!flag) return null;
  return (
    <span role="img" aria-label={`${code.toUpperCase()} flag`} className={className}>
      {flag}
    </span>
  );
}
