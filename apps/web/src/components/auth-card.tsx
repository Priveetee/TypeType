type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 md:p-8 shadow-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
        <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
