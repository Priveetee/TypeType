import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { isAuthPage } from "../lib/auth-routes";
import { useUiStore } from "../stores/ui-store";
import { NavbarAccountControls } from "./navbar-account-controls";
import { SearchOverlay } from "./search-overlay";
import { Toast } from "./toast";

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Search"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Menu"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { status, isAuthed, isGuest, isAdmin, me, signOut } = useAuth();
  const previousStatus = useRef(status);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const authPage = isAuthPage(pathname);
  const canOpenSearch = !authPage;

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (previousStatus.current === status) return;
    const from = previousStatus.current;
    previousStatus.current = status;
    if (status === "authenticated" && from !== "loading") {
      setToast("Signed in");
      return;
    }
    if (status === "signed_out" && from !== "loading") {
      setToast("Signed out");
    }
  }, [status]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!canOpenSearch) return;
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [canOpenSearch]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 flex items-center px-4 gap-4">
        {!authPage && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors p-2 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="TypeType" width={28} height={28} />
          <span className="text-zinc-100 text-sm font-semibold tracking-widest">TYPETYPE</span>
        </Link>
        <div className="flex flex-1 justify-center px-2">
          {canOpenSearch && (
            <>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:inline-flex h-10 w-full max-w-xl items-center justify-between rounded-full border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
                aria-label="Search"
              >
                <span className="inline-flex items-center gap-2">
                  <SearchIcon />
                  <span>Search videos, channels...</span>
                </span>
                <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                  /
                </span>
              </button>
            </>
          )}
        </div>
        <NavbarAccountControls
          status={status}
          isAuthed={isAuthed}
          isGuest={isGuest}
          isAdmin={isAdmin}
          me={me}
          signOut={signOut}
        />
      </nav>
      {searchOpen && canOpenSearch && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      <Toast message={toast} />
    </>
  );
}
