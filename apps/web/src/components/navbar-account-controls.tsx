import { Link } from "@tanstack/react-router";
import { goto } from "../lib/route-redirect";
import type { AuthMe, AuthStatus } from "../types/auth";
import { ProfileAvatar } from "./profile-avatar";

type Props = {
  status: AuthStatus;
  isAuthed: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  me: AuthMe | null;
  isMobile: boolean;
  signOut: () => void;
};

function loginHref() {
  const path = window.location.pathname;
  const search = window.location.search;
  const redirect = `${path}${search}`;
  return `/login?redirect=${encodeURIComponent(redirect)}`;
}

function statusLabel(status: AuthStatus): string {
  if (status === "guest") return "Guest";
  if (status === "authenticated") return "Connected";
  if (status === "loading") return "Loading";
  return "Signed out";
}

export function NavbarAccountControls({
  status,
  isAuthed,
  isGuest,
  isAdmin,
  me,
  isMobile,
  signOut,
}: Props) {
  const profileName = me?.publicUsername?.trim() ? me.publicUsername : null;

  if (isMobile) {
    if (!isAuthed || isGuest || !me) {
      return (
        <a
          href={loginHref()}
          className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        >
          Sign in
        </a>
      );
    }
    return (
      <Link to="/profile" className="inline-flex h-9 w-9 items-center justify-center">
        <ProfileAvatar me={me} className="h-8 w-8" plain />
      </Link>
    );
  }

  return (
    <>
      {!isAuthed || isGuest || !me ? (
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-zinc-500 px-2">
          {statusLabel(status)}
        </span>
      ) : (
        <div className="hidden sm:inline-flex items-center gap-2">
          <Link to="/profile" className="inline-flex h-8 w-8 items-center justify-center">
            <ProfileAvatar me={me} className="h-7 w-7" plain />
          </Link>
          {profileName && (
            <Link
              to="/profile"
              className="max-w-28 truncate text-sm font-medium text-zinc-100 hover:text-white"
            >
              {profileName}
            </Link>
          )}
        </div>
      )}
      {!isAuthed && (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            search={{ redirect: `${window.location.pathname}${window.location.search}` }}
            className="h-8 px-3 inline-flex items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={() => goto("/")}
            className="hidden sm:inline-flex h-8 px-3 text-xs rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
          >
            Browse
          </button>
        </div>
      )}
      {isAuthed && (
        <div className="flex items-center gap-2">
          {!isGuest && me && (
            <Link
              to="/profile"
              className="inline-flex h-8 w-8 items-center justify-center sm:hidden"
            >
              <ProfileAvatar me={me} className="h-7 w-7" plain />
            </Link>
          )}
          {isGuest && (
            <>
              <Link
                to="/login"
                search={{ redirect: `${window.location.pathname}${window.location.search}` }}
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
              className="hidden sm:inline-flex h-8 px-3 items-center text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            >
              Account
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin-console"
              search={{ section: "issues" }}
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
