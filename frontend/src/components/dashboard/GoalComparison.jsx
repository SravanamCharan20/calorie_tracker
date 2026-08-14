const comparisonItems = [
  { key: "calories", label: "Calories", unit: "kcal", barClass: "bg-white" },
  { key: "protein", label: "Protein", unit: "g", barClass: "bg-protein" },
  { key: "carbs", label: "Carbs", unit: "g", barClass: "bg-carbs" },
  { key: "fat", label: "Fat", unit: "g", barClass: "bg-fat" },
];

const GoalComparison = ({ goalComparison }) => {
  if (!goalComparison) return null;

  return (
    <article className="rounded-3xl border border-border bg-card p-6 sm:p-7">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Goal vs actual</h3>
        <p className="mt-1 text-sm text-muted">How today is tracking</p>
      </div>

      <div className="space-y-5">
        {comparisonItems.map(({ key, label, unit, barClass }) => {
          const item = goalComparison[key];
          const percentage =
            item.target > 0
              ? Math.min((item.actual / item.target) * 100, 100)
              : 0;

          return (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-white">{label}</span>
                <span className="text-muted">
                  {item.actual} / {item.target}
                  {unit === "kcal" ? "kcal" : "g"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-card-elevated">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barClass}`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${label} goal progress`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default GoalComparison;
