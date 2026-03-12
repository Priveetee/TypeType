import * as Flags from "country-flag-icons/react/3x2";

type FlagCode = keyof typeof Flags;

function isFlagCode(code: string): code is FlagCode {
  return code in Flags;
}

type FlagIconProps = {
  code: string;
  className?: string;
};

export function FlagIcon({ code, className }: FlagIconProps) {
  if (!isFlagCode(code)) return null;
  const Flag = Flags[code];
  return <Flag className={className} />;
}
