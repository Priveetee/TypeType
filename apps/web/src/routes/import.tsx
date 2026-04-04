import { createFileRoute, Outlet } from "@tanstack/react-router";

function ImportLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/import")({ component: ImportLayout });
