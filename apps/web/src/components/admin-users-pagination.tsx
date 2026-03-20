type AdminUsersPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageStart: number;
  pageEnd: number;
  pending: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function AdminUsersPagination({
  page,
  totalPages,
  total,
  pageStart,
  pageEnd,
  pending,
  onPrev,
  onNext,
}: AdminUsersPaginationProps) {
  return (
    <section className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-400">
      <p>
        {pageStart}-{pageEnd} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending || page <= 1}
          onClick={onPrev}
          className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 text-zinc-200 transition-colors hover:border-zinc-500 disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={pending || page >= totalPages}
          onClick={onNext}
          className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 text-zinc-200 transition-colors hover:border-zinc-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
