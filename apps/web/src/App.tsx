import { useUiStore } from "./stores/ui-store";
import { Navbar } from "./components/navbar";
import { Sidebar } from "./components/sidebar";
import { VideoGrid } from "./components/video-grid";

export function App() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <Sidebar />
      <main
        className={`pt-14 px-4 py-6 transition-all duration-200 ${
          collapsed ? "ml-14" : "ml-60"
        }`}
      >
        <VideoGrid />
      </main>
    </div>
  );
}
