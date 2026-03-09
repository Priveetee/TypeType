import { useState } from "react";

type Props = {
  src: string;
  name: string;
  className?: string;
};

function getInitial(name: string): string {
  if (!name) return "?";
  if (name.startsWith("http")) {
    try {
      const segments = new URL(name).pathname.split("/").filter(Boolean);
      const last = segments.pop() ?? "";
      return (last.replace("@", "")[0] ?? "?").toUpperCase();
    } catch {
      return "?";
    }
  }
  return name[0].toUpperCase();
}

export function ChannelAvatar({ src, name, className = "w-8 h-8" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`${className} rounded-full flex-shrink-0 bg-zinc-700 flex items-center justify-center text-zinc-300 font-medium select-none`}
        style={{ fontSize: "40%" }}
        title={name}
      >
        {getInitial(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${className} rounded-full flex-shrink-0`}
      onError={() => setFailed(true)}
    />
  );
}
