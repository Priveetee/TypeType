import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "../components/auth-card";
import { AuthErrorBanner } from "../components/auth-error-banner";
import { useAuth } from "../hooks/use-auth";
import { sanitizeRedirect } from "../lib/auth-routes";
import { loginSession } from "../lib/auth-session";
import { goto } from "../lib/route-redirect";

function LoginPage() {
  const { isAuthed, isGuest } = useAuth();
  const { redirect } = Route.useSearch();
  const target = sanitizeRedirect(redirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (isAuthed && !isGuest) {
    goto(target);
    return null;
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await loginSession({ email: email.trim(), password });
      goto(target);
    } catch {
      setError("Invalid credentials.");
    }
    setPending(false);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <AuthCard
        title="Sign in"
        subtitle="On a new install, create the first account first. It becomes admin."
      >
        <AuthErrorBanner message={error} />
        <div className="mb-3 rounded-lg border border-sky-800/60 bg-sky-950/30 px-3 py-2 text-xs text-sky-200">
          New instance setup: first account creation is required before any sign in.
        </div>
        <Link
          to="/register"
          search={{ redirect }}
          className="mb-4 h-10 w-full rounded-lg bg-zinc-100 text-zinc-900 text-sm font-semibold inline-flex items-center justify-center hover:bg-white"
        >
          Create first account
        </Link>
        <div className="mb-3 text-xs text-zinc-500">
          Already created the first account? Sign in below.
        </div>
        <form className="flex flex-col gap-3" onSubmit={submitLogin}>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
            required
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-xs text-zinc-500 flex items-center justify-end">
          <Link
            to="/reset-password"
            className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2"
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
