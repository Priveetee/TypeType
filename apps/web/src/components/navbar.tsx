import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { isAuthPage } from "../lib/auth-routes";
import { useUiStore } from "../stores/ui-store";
import { NavbarAccountControls } from "./navbar-account-controls";
import { SearchOverlay } from "./search-overlay";

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
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { status, isAuthed, isGuest, isAdmin, signOut } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const authPage = isAuthPage(pathname);
  const canOpenSearch = isAuthed && !authPage;

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
        <div className="flex-1" />
        {canOpenSearch && (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 h-8 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-zinc-400 hover:text-zinc-100 text-xs"
            aria-label="Search"
          >
            <SearchIcon />
            <span className="text-zinc-500">/</span>
          </button>
        )}
        <NavbarAccountControls
          status={status}
          isAuthed={isAuthed}
          isGuest={isGuest}
          isAdmin={isAdmin}
          signOut={signOut}
        />
      </nav>
      {searchOpen && canOpenSearch && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
