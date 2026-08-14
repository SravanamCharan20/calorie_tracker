const goalFields = [
  {
    key: "dailyCalorieTarget",
    label: "Daily calories",
    unit: "kcal",
  },
  {
    key: "proteinTarget",
    label: "Protein",
    unit: "g",
  },
  {
    key: "carbTarget",
    label: "Carbohydrates",
    unit: "g",
  },
  {
    key: "fatTarget",
    label: "Fat",
    unit: "g",
  },
  {
    key: "weightGoal",
    label: "Weight goal",
    unit: "lb",
  },
];

const GoalsForm = ({ form, onChange, onSubmit, isSaving, error, success }) => (
  <form onSubmit={onSubmit}>
    <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white">Daily nutrition goals</h3>
        <p className="mt-1 text-sm text-muted">
          These targets power your dashboard and reports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {goalFields.map(({ key, label, unit }) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="mb-2 block text-sm font-medium text-muted"
            >
              {label}
            </label>
            <div className="relative">
              <input
                id={key}
                type="number"
                min="0"
                value={form[key]}
                onChange={(e) => onChange(key, e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-card-elevated px-4 py-3.5 pr-14 text-sm text-white outline-none transition-colors focus:border-border-focus"
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-subtle">
                {unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="mt-5 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
        >
          {success}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </article>
  </form>
);

export default GoalsForm;
