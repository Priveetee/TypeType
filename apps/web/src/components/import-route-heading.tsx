type Props = {
  label: string;
  title: string;
  description: string;
  labelClassName?: string;
};

export function ImportRouteHeading({ label, title, description, labelClassName }: Props) {
  return (
    <div className="px-1">
      <p
        className={`font-mono text-xs uppercase tracking-[0.2em] ${labelClassName ?? "text-zinc-500"}`}
      >
        {label}
      </p>
      <h1 className="mt-2 font-mono text-2xl font-semibold tracking-tight text-zinc-100">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">{description}</p>
    </div>
  );
}
