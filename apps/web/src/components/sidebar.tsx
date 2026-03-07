import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { siBilibili, siNiconico, siYoutube } from "simple-icons";
import { useSettings } from "../hooks/use-settings";
import { useUiStore } from "../stores/ui-store";
import type { ServiceId } from "../types/user";
import { ServiceIcon } from "./service-icon";

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    to: "/",
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  },
  {
    label: "Trending",
    to: "/trending",
    icon: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
  },
  {
    label: "Subscriptions",
    to: "/subscriptions",
    icon: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  },
  {
    label: "History",
    to: "/history",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    label: "Playlists",
    to: "/playlists",
    icon: (
      <>
        <path d="M3 5h15" />
        <path d="M3 9h15" />
        <path d="M3 13h9" />
        <path d="M15 13l4 3-4 3V13z" />
      </>
    ),
  },
  {
    label: "Settings",
    to: "/settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
];

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
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const { settings, update } = useSettings();
  const service = settings.defaultService;
  const navigate = useNavigate();
  const loc = useRouterState({ select: (s) => s.location });

  function handleServiceClick(id: ServiceId) {
    update.mutate({ defaultService: id });
    if (loc.pathname !== "/search") return;
    const q = new URLSearchParams(loc.searchStr).get("q") ?? "";
    navigate({ to: "/search", search: { q, service: id } });
  }

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-40 bg-zinc-950 flex flex-col py-4 transition-all duration-200 ${
        collapsed ? "w-14" : "w-48"
      }`}
    >
      <div className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={item.to === "/" ? { exact: true } : undefined}
            className={`${BTN_BASE} ${collapsed ? "justify-center px-0" : "gap-3 px-2"}`}
            activeProps={{ className: BTN_ACTIVE }}
            inactiveProps={{ className: BTN_INACTIVE }}
          >
            <NavIcon label={item.label}>{item.icon}</NavIcon>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="mt-4 mx-2 border-t border-zinc-800 pt-4 flex flex-col gap-1">
        {!collapsed && (
          <p className="text-xs text-zinc-600 px-2 mb-1 uppercase tracking-wider">Services</p>
        )}
        {SERVICES.map((svc) => (
          <button
            key={svc.label}
            type="button"
            onClick={() => handleServiceClick(svc.id)}
            className={`${BTN_BASE} ${collapsed ? "justify-center px-0" : "gap-3 px-2 text-left"} ${
              service === svc.id ? BTN_ACTIVE : BTN_INACTIVE
            }`}
          >
            <ServiceIcon path={svc.path} color={svc.color} label={svc.label} />
            {!collapsed && <span className="text-sm">{svc.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
