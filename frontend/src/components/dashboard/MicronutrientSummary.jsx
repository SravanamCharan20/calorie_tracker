import { MICRONUTRIENT_REFERENCES } from "../../utils/nutritionCal.js";

const micronutrientColors = {
  iron: "#b85450",
  calcium: "#7a8fa8",
  vitaminC: "#c4a574",
  vitaminD: "#7a9e7e",
};

const MicronutrientSummary = ({ micronutrients }) => {
  const items = Object.entries(MICRONUTRIENT_REFERENCES).map(
    ([key, reference]) => {
      const consumed = micronutrients[key] ?? 0;
      const percentage =
        reference.target > 0
          ? Math.min((consumed / reference.target) * 100, 100)
          : 0;

      return {
        key,
        ...reference,
        consumed,
        percentage,
        color: micronutrientColors[key],
      };
    },
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">
          Micronutrient summary
        </h3>
        <p className="mt-0.5 text-sm text-muted">Today&apos;s intake vs daily reference</p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map(
          ({ key, label, unit, target, consumed, percentage, color }) => (
            <div
              key={key}
              className="rounded-xl border border-border bg-card-elevated p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <span className="text-xs text-muted">
                  {formatAmount(consumed, unit)} / {formatAmount(target, unit)}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-card">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${label} intake`}
                />
              </div>

              <p className="mt-2 text-xs text-muted">
                {percentage.toFixed(0)}% of daily reference
              </p>
            </div>
          ),
        )}
      </div>
    </article>
  );
};

const formatAmount = (value, unit) => {
  const formatted =
    unit === "mg" && value >= 100
      ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
      : value.toLocaleString(undefined, { maximumFractionDigits: 1 });

  return `${formatted}${unit}`;
};

export default MicronutrientSummary;
