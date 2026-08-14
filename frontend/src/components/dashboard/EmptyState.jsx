const EmptyState = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card-elevated px-6 py-10 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-muted">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path d="M6 3v8M10 3v8M6 11v10M10 11v10M14 3v18M18 3c1.5 0 3 1.5 3 4v4c0 2.5-1.5 4-3 4" />
      </svg>
    </div>
    <p className="text-sm font-medium text-white">{title}</p>
    <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
  </div>
);

export default EmptyState;
