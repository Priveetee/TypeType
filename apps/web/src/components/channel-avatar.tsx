import { useState } from "react";

type Props = {
  src: string;
  name: string;
  className?: string;
};

export function ChannelAvatar({ src, name, className = "w-8 h-8" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`${className} rounded-full flex-shrink-0 bg-zinc-700`} title={name} />;
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
