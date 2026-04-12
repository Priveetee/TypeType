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
        className="text-fg-muted hover:text-fg hover:bg-surface-strong transition-colors p-2 rounded-lg"
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
      className="text-fg-muted hover:text-fg hover:bg-surface-strong transition-colors p-2 rounded-lg"
      aria-label="Toggle sidebar"
    >
      <Menu size={18} />
    </button>
  );
}
