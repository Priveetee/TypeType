import { ImportMascotLoop } from "./import-mascot-loop";

export function PipePipeImportCookingState() {
  return (
    <div className="rounded-2xl border border-red-700/35 bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-950/40 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
        <ImportMascotLoop
          primarySrc="/import-dudu-cooking.webm"
          secondarySrc="/import-cooking-chef.webm"
          className="h-32 w-full rounded-xl object-cover sm:h-28"
        />
        <div>
          <p className="text-base font-medium text-zinc-100">Restoring your backup</p>
          <p className="mt-1 text-sm text-zinc-300/80">We are plating your data now.</p>
        </div>
      </div>
    </div>
  );
}
