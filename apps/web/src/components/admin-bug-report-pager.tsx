type Props = {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function AdminBugReportPager({ page, totalPages, total, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-between text-xs text-fg-soft">
      <span>
        {total} report{total !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={onPrev}
          className="rounded border border-border-strong px-2 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={onNext}
          className="rounded border border-border-strong px-2 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
