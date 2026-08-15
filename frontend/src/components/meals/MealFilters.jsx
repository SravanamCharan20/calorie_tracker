const filters = [
  { label: "All", value: "" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snacks" },
];

const inputClassName =
  "w-full rounded-xl border border-border bg-card-elevated px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-border-focus [color-scheme:dark]";

const MealFilters = ({
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates,
}) => {
  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map(({ label, value }) => {
            const isActive = activeFilter === value;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onFilterChange(value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "border border-border text-muted hover:border-border-focus hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search meals"
            className="w-full rounded-full border border-border bg-card-elevated py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-subtle outline-none transition-colors focus:border-border-focus"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="meal-start-date"
                className="mb-2 block text-sm font-medium text-muted"
              >
                From date
              </label>
              <input
                id="meal-start-date"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => onStartDateChange(e.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label
                htmlFor="meal-end-date"
                className="mb-2 block text-sm font-medium text-muted"
              >
                To date
              </label>
              <input
                id="meal-end-date"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => onEndDateChange(e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          {hasDateFilter && (
            <button
              type="button"
              onClick={onClearDates}
              className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Clear dates
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-muted">
          Filter meals by date range and meal type. Leave dates empty to show all
          entries.
        </p>
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3-3" />
  </svg>
);

export default MealFilters;
