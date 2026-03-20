import type { AuthRole, AuthUser } from "../types/auth";

export type AdminFilter = "all" | AuthRole | "suspended";

export const ADMIN_FILTERS: { value: AdminFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admins" },
  { value: "moderator", label: "Mods" },
  { value: "user", label: "Users" },
  { value: "suspended", label: "Suspended" },
];

export function isAdminFilter(value: string): value is AdminFilter {
  return (
    value === "all" ||
    value === "admin" ||
    value === "moderator" ||
    value === "user" ||
    value === "suspended"
  );
}

export function matchesAdminFilter(user: AuthUser, filter: AdminFilter): boolean {
  if (filter === "all") return true;
  if (filter === "suspended") return user.suspended;
  return user.role === filter;
}

export function formatCreatedAt(value: number | string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
