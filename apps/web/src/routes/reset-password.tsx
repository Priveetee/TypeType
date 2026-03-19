import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "../components/auth-card";
import { AuthErrorBanner } from "../components/auth-error-banner";
import { resetPassword } from "../lib/api-auth";

function ResetPasswordPage() {
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setDone(false);
    setError(null);
    try {
      await resetPassword({ resetToken: resetToken.trim(), newPassword });
      setDone(true);
      setResetToken("");
      setNewPassword("");
    } catch {
      setError("Invalid or expired reset token.");
    }
    setPending(false);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <AuthCard title="Reset password" subtitle="Use the token generated from the admin panel.">
        <AuthErrorBanner message={error} />
        {done && (
          <div className="mb-4 rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">
            Password updated. You can sign in with your new password.
          </div>
        )}
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <input
            type="text"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Reset token"
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100"
            required
          />
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-lg bg-zinc-100 text-zinc-900 text-sm font-medium disabled:opacity-60"
          >
            {pending ? "Updating..." : "Update password"}
          </button>
        </form>
        <div className="mt-4 text-xs text-zinc-500">
          <Link to="/login" search={{ redirect: undefined }} className="hover:text-zinc-300">
            Back to login
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}

export const Route = createFileRoute("/reset-password")({ component: ResetPasswordPage });
