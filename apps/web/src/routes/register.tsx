import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "../components/auth-card";
import { AuthErrorBanner } from "../components/auth-error-banner";
import { useAuth } from "../hooks/use-auth";
import { sanitizeRedirect } from "../lib/auth-routes";
import { registerSession } from "../lib/auth-session";
import { goto } from "../lib/route-redirect";

function RegisterPage() {
  const { isAuthed, isGuest } = useAuth();
  const { redirect } = Route.useSearch();
  const target = sanitizeRedirect(redirect);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (isAuthed && !isGuest) {
    goto(target);
    return null;
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await registerSession({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      goto(target);
    } catch {
      setError("Unable to create account.");
    }
    setPending(false);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <AuthCard
        title="Create account"
        subtitle="On a fresh install, the first account is automatically admin."
      >
        <AuthErrorBanner message={error} />
        <form className="flex flex-col gap-3" onSubmit={submitRegister}>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
            required
          />
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
            autoComplete="new-password"
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
            {pending ? "Creating account..." : "Register"}
          </button>
        </form>
        <div className="mt-4 text-xs text-zinc-500">
          <Link to="/login" search={{ redirect }} className="hover:text-zinc-300">
            Already have an account? Sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: RegisterPage,
});
