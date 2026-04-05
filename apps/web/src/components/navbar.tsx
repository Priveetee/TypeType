import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useAuthToasts } from "../hooks/use-auth-toasts";
import { useMobile } from "../hooks/use-mobile";
import { useSearchShortcut } from "../hooks/use-search-shortcut";
import { isAuthPage } from "../lib/auth-routes";
import { useUiStore } from "../stores/ui-store";
import { NavbarAccountControls } from "./navbar-account-controls";
import { NavbarNotifications } from "./navbar-notifications";
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
  const toast = useAuthToasts();
  const isMobile = useMobile();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleMobileSidebar = useUiStore((s) => s.toggleMobileSidebar);
  const { status, isAuthed, isGuest, isAdmin, me, signOut } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const authPage = isAuthPage(pathname);
  const canOpenSearch = !authPage;
  const navClass = isMobile
    ? "fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 flex items-center px-2 gap-2"
    : "fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 flex items-center px-4 gap-4";

  useSearchShortcut({ enabled: canOpenSearch, onOpen: () => setSearchOpen(true) });

  return (
    <>
      <nav className={navClass}>
        {!authPage && (
          <button
            type="button"
            onClick={isMobile ? toggleMobileSidebar : toggleSidebar}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors p-2 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
        )}
        <Link to="/" className="flex min-w-0 shrink items-center gap-2">
          <img src="/logo.svg" alt="TypeType" width={28} height={28} />
          <span className="max-w-28 truncate text-zinc-100 text-sm font-semibold tracking-widest sm:max-w-none">
            TYPETYPE
          </span>
        </Link>
        <div
          className={
            isMobile ? "ml-auto flex items-center gap-1" : "flex flex-1 justify-center px-2"
          }
        >
          {canOpenSearch && isMobile && (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          )}
          {canOpenSearch && !isMobile && (
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
          )}
          <NavbarNotifications />
          <NavbarAccountControls
            status={status}
            isAuthed={isAuthed}
            isGuest={isGuest}
            isAdmin={isAdmin}
            me={me}
            isMobile={isMobile}
            signOut={signOut}
          />
        </div>
      </nav>
      {searchOpen && canOpenSearch && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      <Toast message={toast} />
    </>
  );
}
