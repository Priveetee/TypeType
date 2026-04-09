type AdminSection = "settings" | "users" | "issues";

type Props = {
  section: AdminSection;
};

const TITLES: Record<AdminSection, string> = {
  settings: "Admin Settings",
  users: "User Management",
  issues: "Issue Triage",
};

const DESCRIPTIONS: Record<AdminSection, string> = {
  settings: "Global moderation and platform switches.",
  users: "Roles, suspension, and account recovery tools.",
  issues: "Bug reports, diagnostics, status updates, and GitHub sync.",
};

export function AdminConsoleHeader({ section }: Props) {
  return (
    <header className="px-1 pb-1">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Admin Console</p>
      <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-zinc-100">
        {TITLES[section]}
      </h1>
      <p className="mt-1 text-sm text-zinc-400">{DESCRIPTIONS[section]}</p>
    </header>
  );
}
