import { siBilibili, siNiconico, siYoutube } from "simple-icons";
import { ServiceIcon } from "../components/service-icon";
import type { ServiceId } from "../stores/service-store";
import { useServiceStore } from "../stores/service-store";

type ServiceOption = {
  id: ServiceId;
  label: string;
  path: string;
  color: string;
};

const SERVICES: ServiceOption[] = [
  { id: 0, label: "YouTube", path: siYoutube.path, color: "#FF0000" },
  { id: 6, label: "NicoNico", path: siNiconico.path, color: "#aaaaaa" },
  { id: 5, label: "BiliBili", path: siBilibili.path, color: "#00A1D6" },
];

const SECTION_LABEL = "text-xs font-medium text-zinc-500 uppercase tracking-wider px-1";
const CARD =
  "bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800";

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
        selected ? "border-zinc-100 bg-zinc-100" : "border-zinc-600"
      }`}
    >
      {selected && <span className="w-2 h-2 rounded-full bg-zinc-900" />}
    </span>
  );
}

export function SettingsService() {
  const { service, setService } = useServiceStore();

  return (
    <section className="flex flex-col gap-3">
      <p className={SECTION_LABEL}>Default service</p>
      <div className={CARD}>
        {SERVICES.map((svc) => (
          <button
            key={svc.id}
            type="button"
            onClick={() => setService(svc.id)}
            className={`flex items-center gap-3 px-4 py-3.5 w-full text-left transition-colors ${
              service === svc.id ? "bg-zinc-800/60" : "hover:bg-zinc-800/30"
            }`}
          >
            <ServiceIcon path={svc.path} color={svc.color} label={svc.label} />
            <span className="flex-1 text-sm text-zinc-100">{svc.label}</span>
            <RadioDot selected={service === svc.id} />
          </button>
        ))}
      </div>
    </section>
  );
}
