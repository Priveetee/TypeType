import type { ChangeEvent } from "react";
import { ADMIN_FILTERS, type AdminFilter, isAdminFilter } from "../lib/admin-console";

type AdminUserToolbarProps = {
  search: string;
  filter: AdminFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: AdminFilter) => void;
};

export function AdminUserToolbar({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: AdminUserToolbarProps) {
  function handleFilter(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    if (!isAdminFilter(next)) return;
    onFilterChange(next);
  }

  return (
    <section className="flex items-center gap-2">
      <div className="w-full max-w-sm">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search name, email or id"
          className="h-9 w-full rounded-md border border-border-strong bg-surface px-3 text-sm text-fg outline-none transition-colors focus:border-border-strong"
        />
      </div>
      <select
        value={filter}
        onChange={handleFilter}
        className="h-9 rounded-md border border-border-strong bg-surface px-2 text-xs text-fg-muted"
      >
        {ADMIN_FILTERS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </section>
  );
}
