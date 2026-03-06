import { useState } from "react";

type Props = {
  description: string;
};

export function WatchDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        type="button"
        className="w-full text-left bg-zinc-900 rounded-xl px-4 py-3 hover:bg-zinc-800 transition-colors"
        onClick={() => setExpanded(true)}
      >
        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3 whitespace-pre-wrap">
          {description}
        </p>
        <span className="mt-2 block text-xs font-medium text-zinc-100">Show more</span>
      </button>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl px-4 py-3">
      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{description}</p>
      <button
        type="button"
        className="mt-3 text-xs font-medium text-zinc-100 hover:text-white"
        onClick={() => setExpanded(false)}
      >
        Show less
      </button>
    </div>
  );
}
