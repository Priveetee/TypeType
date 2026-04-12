import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard } from "../components/auth-card";
import { AuthErrorBanner } from "../components/auth-error-banner";
import { Toast } from "../components/toast";
import { useAuth } from "../hooks/use-auth";
import { sanitizeRedirect } from "../lib/auth-routes";
import { loginSession } from "../lib/auth-session";
import { goto } from "../lib/route-redirect";

function LoginPage() {
  const { isAuthed, isGuest } = useAuth();
  const { redirect } = Route.useSearch();
  const target = sanitizeRedirect(redirect);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  if (isAuthed && !isGuest) {
    goto(target);
    return null;
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await loginSession({ identifier: identifier.trim(), password });
      setToast("Signed in");
      goto(target);
    } catch {
      setError("Invalid credentials.");
    }
    setPending(false);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <Toast message={toast} />
      <AuthCard title="Sign in" subtitle="Use your account credentials to continue.">
        <AuthErrorBanner message={error} />
        <form className="flex flex-col gap-3" onSubmit={submitLogin}>
          <input
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email or username"
            className="h-10 rounded-lg border border-border-strong bg-app px-3 text-sm text-fg"
            required
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-10 rounded-lg border border-border-strong bg-app px-3 text-sm text-fg"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-lg bg-fg text-app text-sm font-medium disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-xs text-fg-soft flex items-center justify-between">
          <Link
            to="/register"
            search={{ redirect }}
            className="text-fg-muted hover:text-fg underline underline-offset-2"
          >
            Create account
          </Link>
          <Link
            to="/reset-password"
            className="text-fg-muted hover:text-fg underline underline-offset-2"
          >
            Reset password
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});
