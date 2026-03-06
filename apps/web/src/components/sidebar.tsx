import { siBilibili, siNiconico, siYoutube } from "simple-icons";
import { useUiStore } from "../stores/ui-store";

type NavItem = {
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  },
  {
    label: "Trending",
    icon: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
  },
  {
    label: "Subscriptions",
    icon: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
  },
  {
    label: "History",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
];

type Service = {
  label: string;
  path: string;
  color: string;
};

const SERVICES: Service[] = [
  { label: "YouTube", path: siYoutube.path, color: "#FF0000" },
  { label: "NicoNico", path: siNiconico.path, color: "#aaaaaa" },
  { label: "BiliBili", path: siBilibili.path, color: "#00A1D6" },
];

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

function ServiceIcon({ path, color, label }: { path: string; color: string; label: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={color}
      className="flex-shrink-0"
      role="img"
      aria-label={label}
    >
      <path d={path} />
    </svg>
  );
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-40 bg-zinc-950 flex flex-col py-4 transition-all duration-200 ${
        collapsed ? "w-14" : "w-60"
      }`}
    >
      <div className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex items-center h-10 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors w-full ${
              collapsed ? "justify-center px-0" : "gap-3 px-2 text-left"
            }`}
          >
            <NavIcon label={item.label}>{item.icon}</NavIcon>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 mx-2 border-t border-zinc-800 pt-4 flex flex-col gap-1">
        {!collapsed && (
          <p className="text-xs text-zinc-600 px-2 mb-1 uppercase tracking-wider">Services</p>
        )}
        {SERVICES.map((service) => (
          <button
            key={service.label}
            type="button"
            className={`flex items-center h-10 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors w-full ${
              collapsed ? "justify-center px-0" : "gap-3 px-2 text-left"
            }`}
          >
            <ServiceIcon path={service.path} color={service.color} label={service.label} />
            {!collapsed && <span className="text-sm">{service.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
