import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export function ShortsNavigation({ onPrev, onNext, hasPrev, hasNext }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <NavButton icon={ChevronUp} onClick={onPrev} disabled={!hasPrev} label="Previous" />
      <NavButton icon={ChevronDown} onClick={onNext} disabled={!hasNext} label="Next" />
    </div>
  );
}

type NavButtonProps = {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled: boolean;
  label: string;
};

function NavButton({ icon: Icon, onClick, disabled, label }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-strong/80 text-white/90 hover:bg-surface-soft/80 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
