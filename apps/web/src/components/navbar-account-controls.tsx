import { Link } from "@tanstack/react-router";
import { goto } from "../lib/route-redirect";
import type { AuthStatus } from "../types/auth";

type Props = {
  status: AuthStatus;
  isAuthed: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  signOut: () => void;
};

function statusLabel(status: AuthStatus): string {
  if (status === "guest") return "Guest";
  if (status === "authenticated") return "Connected";
  if (status === "loading") return "Loading";
  return "Signed out";
}

export function NavbarAccountControls({ status, isAuthed, isGuest, isAdmin, signOut }: Props) {
  return (
    <>
      <span className="text-[11px] uppercase tracking-wider text-zinc-500 px-2">
        {statusLabel(status)}
      </span>
      {!isAuthed && (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            search={{ redirect: undefined }}
            className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => goto("/")}
            className="h-8 px-3 text-xs rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
          >
            Browse
          </button>
        </div>
      )}
      {isAuthed && (
        <div className="flex items-center gap-2">
          {isGuest && (
            <>
              <Link
                to="/login"
                search={{ redirect: undefined }}
                className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                search={{ redirect: undefined }}
                className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-100 text-zinc-900 hover:bg-white"
              >
                Register
              </Link>
            </>
          )}
          {!isGuest && !isAdmin && (
            <Link
              to="/settings"
              className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            >
              Account
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin-console"
              className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            >
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="h-8 px-3 text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
