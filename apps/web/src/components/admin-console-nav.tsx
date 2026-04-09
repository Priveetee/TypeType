type AdminSection = "settings" | "users" | "issues";

type Item = {
  key: AdminSection;
  label: string;
};

type Props = {
  items: Item[];
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
};

export function AdminConsoleNav({ items, active, onSelect }: Props) {
  return (
    <nav className="pt-3" aria-label="Admin sections">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(item.key)}
              className={`border-b px-1 py-2 text-left font-mono text-xs uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "border-zinc-200 text-zinc-100"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
