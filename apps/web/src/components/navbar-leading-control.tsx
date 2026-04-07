import { ChevronLeft, Menu } from "lucide-react";

type Props = {
  authPage: boolean;
  showBackButton: boolean;
  onBack: () => void;
  onToggleSidebar: () => void;
};

export function NavbarLeadingControl({ authPage, showBackButton, onBack, onToggleSidebar }: Props) {
  if (authPage) return null;

  if (showBackButton) {
    return (
      <button
        type="button"
        onClick={onBack}
        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors p-2 rounded-lg"
        aria-label="Go back"
      >
        <ChevronLeft size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggleSidebar}
      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors p-2 rounded-lg"
      aria-label="Toggle sidebar"
    >
      <Menu size={18} />
    </button>
  );
}
