const ErrorDashboard = ({ error, onRetry }) => (
  <div className="flex min-h-screen items-center justify-center bg-surface px-4">
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h1 className="text-lg font-semibold text-white">
        Unable to load dashboard
      </h1>
      <p className="mt-2 text-sm text-muted">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  </div>
);

export default ErrorDashboard;
