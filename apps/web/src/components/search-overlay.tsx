import { useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
};

export function SearchOverlay({ onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="Search videos, channels..."
          className="w-full h-12 bg-zinc-900 border border-zinc-700 rounded-lg px-4 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
        />
      </div>
    </div>
  );
}
