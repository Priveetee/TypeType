import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useAuthToasts } from "../hooks/use-auth-toasts";
import { useMobile } from "../hooks/use-mobile";
import { useSearchShortcut } from "../hooks/use-search-shortcut";
import { isAuthPage } from "../lib/auth-routes";
import { useUiStore } from "../stores/ui-store";
import { NavbarAccountControls } from "./navbar-account-controls";
import { NavbarLeadingControl } from "./navbar-leading-control";
import { NavbarNotifications } from "./navbar-notifications";
import { Toast } from "./toast";

const SearchOverlay = lazy(() =>
  import("./search-overlay").then((module) => ({
    default: module.SearchOverlay,
  })),
);

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
  const showBackButton = isMobile && canOpenSearch && pathname !== "/";
  const navClass = isMobile
    ? "fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 flex items-center px-2 gap-2"
    : "fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 flex items-center px-4 gap-4";

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.assign("/");
  }

  useSearchShortcut({ enabled: canOpenSearch, onOpen: () => setSearchOpen(true) });

  return (
    <>
      <nav className={navClass}>
        <div className="flex min-w-0 items-center gap-2">
          <NavbarLeadingControl
            authPage={authPage}
            showBackButton={showBackButton}
            onBack={handleBack}
            onToggleSidebar={isMobile ? toggleMobileSidebar : toggleSidebar}
          />
          <Link to="/" className="flex min-w-0 shrink items-center gap-2">
            <img src="/logo.svg" alt="TypeType" width={28} height={28} />
            <span className="max-w-28 truncate text-zinc-100 text-sm font-semibold tracking-widest sm:max-w-none">
              TYPETYPE
            </span>
          </Link>
        </div>

        {canOpenSearch && isMobile && (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        )}

        {canOpenSearch && !isMobile && (
          <div className="mx-4 flex min-w-0 flex-1 justify-center">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 w-full max-w-xl items-center justify-between rounded-full border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 sm:inline-flex"
              aria-label="Search"
            >
              <span className="inline-flex items-center gap-2">
                <Search size={18} />
                <span>Search videos, channels...</span>
              </span>
              <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                /
              </span>
            </button>
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
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
      {searchOpen && canOpenSearch && (
        <Suspense fallback={null}>
          <SearchOverlay onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
      <Toast message={toast} />
    </>
  );
}
