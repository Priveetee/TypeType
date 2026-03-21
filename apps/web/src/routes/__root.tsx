import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "../components/navbar";
import { Sidebar } from "../components/sidebar";
import { useAuth } from "../hooks/use-auth";
import { isAdminRoute, isAuthPage, requiresAuth } from "../lib/auth-routes";
import { bootstrapSession } from "../lib/auth-session";
import { useUiStore } from "../stores/ui-store";

function AuthShell() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-sky-700/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <main className="relative z-10 min-h-screen px-4 py-8 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}

function RootLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const { isAuthed, isAdmin, status } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const shortsPage = pathname === "/shorts";

  useEffect(() => {
    void bootstrapSession();
  }, []);

  useEffect(() => {
    const loader = document.getElementById("app-loader");
    if (!loader) return;
    loader.style.opacity = "0";
    const timer = setTimeout(() => loader.remove(), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!isAuthed && isAdminRoute(pathname)) {
      const redirect = encodeURIComponent(pathname);
      window.location.replace(`/login?redirect=${redirect}`);
      return;
    }
    if (!isAuthed && requiresAuth(pathname)) {
      const redirect = encodeURIComponent(pathname);
      window.location.replace(`/login?redirect=${redirect}`);
      return;
    }
    if (isAdminRoute(pathname) && !isAdmin) {
      window.location.replace("/");
    }
  }, [isAuthed, isAdmin, status, pathname]);

  if (status === "loading" && (requiresAuth(pathname) || isAdminRoute(pathname))) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-sm text-zinc-400">Loading session...</p>
      </div>
    );
  }

  const authPage = isAuthPage(pathname);

  if (authPage) {
    return <AuthShell />;
  }

  if (shortsPage) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="pt-14">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <Sidebar />
      <main
        className={`pt-14 px-4 py-6 transition-all duration-200 ${collapsed ? "ml-14" : "ml-48"}`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({ component: RootLayout });
