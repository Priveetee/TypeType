import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { siBilibili, siNiconico, siYoutube } from "simple-icons";
import { useAuth } from "../hooks/use-auth";
import { useMobile } from "../hooks/use-mobile";
import { useSettings } from "../hooks/use-settings";
import { useUiStore } from "../stores/ui-store";
import type { ServiceId } from "../types/user";
import { NAV_ITEMS } from "./nav-items";
import { ServiceIcon } from "./service-icon";

type Service = {
  id: ServiceId;
  label: string;
  path: string;
  color: string;
};

const SERVICES: Service[] = [
  { id: 0, label: "YouTube", path: siYoutube.path, color: "#FF0000" },
  { id: 6, label: "NicoNico", path: siNiconico.path, color: "#aaaaaa" },
  { id: 5, label: "BiliBili", path: siBilibili.path, color: "#00A1D6" },
];

const BTN_BASE = "flex items-center h-10 rounded-lg transition-colors w-full";
const BTN_ACTIVE = "text-zinc-100 bg-zinc-800";
const BTN_INACTIVE = "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800";

function NavIcon({ children, label }: { children: React.ReactNode; label: string }) {
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
      className="flex-shrink-0"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

export function Sidebar() {
  const isMobile = useMobile();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((s) => s.closeMobileSidebar);
  const { isAdmin, isAuthed, signOut } = useAuth();
  const { settings, update } = useSettings();
  const service = settings.defaultService;
  const navigate = useNavigate();
  const loc = useRouterState({ select: (s) => s.location });

  function handleServiceClick(id: ServiceId) {
    update.mutate({ defaultService: id });
    if (isMobile) closeMobileSidebar();
    if (loc.pathname !== "/search") return;
    const q = new URLSearchParams(loc.searchStr).get("q") ?? "";
    navigate({ to: "/search", search: { q, service: id } });
  }

  const baseClasses = isMobile
    ? `fixed top-14 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-zinc-950 flex flex-col py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] transition-transform duration-200 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`
    : `fixed top-14 left-0 bottom-0 z-40 bg-zinc-950 flex flex-col py-4 transition-all duration-200 ${
        collapsed ? "w-14" : "w-48"
      }`;
  const sectionPadding = isMobile ? "px-3" : "px-2";
  const itemLayout = isMobile
    ? "justify-start gap-3 px-2"
    : collapsed
      ? "justify-center px-0"
      : "gap-3 px-2";

  if (isMobile && !mobileOpen) return null;

  return (
    <>
      {isMobile && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 top-14 z-40 bg-black/50"
          onClick={closeMobileSidebar}
        />
      )}
      <aside className={baseClasses}>
        <div className={`flex flex-col gap-1 ${sectionPadding}`}>
          {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={item.to === "/" ? { exact: true } : undefined}
              className={`${BTN_BASE} ${itemLayout}`}
              onClick={isMobile ? closeMobileSidebar : undefined}
              activeProps={{ className: BTN_ACTIVE }}
              inactiveProps={{ className: BTN_INACTIVE }}
            >
              <NavIcon label={item.label}>{item.icon}</NavIcon>
              {(!collapsed || isMobile) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </div>

        <div className={`mt-4 ${sectionPadding} border-t border-zinc-800 pt-4 flex flex-col gap-1`}>
          {(!collapsed || isMobile) && (
            <p className="text-xs text-zinc-600 px-2 mb-1 uppercase tracking-wider">Services</p>
          )}
          {SERVICES.map((svc) => (
            <button
              key={svc.label}
              type="button"
              onClick={() => handleServiceClick(svc.id)}
              className={`${BTN_BASE} ${
                isMobile
                  ? "justify-start gap-3 px-2 text-left"
                  : collapsed
                    ? "justify-center px-0"
                    : "gap-3 px-2 text-left"
              } ${service === svc.id ? BTN_ACTIVE : BTN_INACTIVE}`}
            >
              <ServiceIcon path={svc.path} color={svc.color} label={svc.label} />
              {(!collapsed || isMobile) && <span className="text-sm">{svc.label}</span>}
            </button>
          ))}
        </div>
        {isMobile && isAuthed && (
          <div className="mt-auto px-3 pt-4">
            <button
              type="button"
              onClick={() => {
                signOut();
                closeMobileSidebar();
              }}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
