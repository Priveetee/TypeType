import { proxyImage } from "../lib/proxy";

type Props = {
  poster?: string;
  title?: string;
};

export function AudioOnlyPoster({ poster, title }: Props) {
  const image = poster ? proxyImage(poster) : "";
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
      {image ? (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30 blur-2xl"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
            <img
              src={image}
              alt={title ?? "Audio only"}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-zinc-950" />
      )}
    </div>
  );
}
