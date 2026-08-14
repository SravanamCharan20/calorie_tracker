const macroColors = {
  protein: "#7a9e7e",
  carbs: "#c4a574",
  fat: "#7a8fa8",
};

const MacroDistribution = ({ macroPercentages, totalCalories }) => {
  const { protein, carbs, fat } = macroPercentages;
  const total = protein + carbs + fat;

  const segments =
    total === 0
      ? [{ color: "#2a2a2a", value: 100 }]
      : [
          { color: macroColors.protein, value: protein },
          { color: macroColors.carbs, value: carbs },
          { color: macroColors.fat, value: fat },
        ];

  let cumulative = 0;
  const gradientStops = segments
    .map((segment) => {
      const start = cumulative;
      cumulative += segment.value;
      return `${segment.color} ${start}% ${cumulative}%`;
    })
    .join(", ");

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">Macro distribution</h3>
        <p className="mt-0.5 text-sm text-muted">
          Today&apos;s calorie breakdown
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `conic-gradient(${gradientStops})`,
            }}
            role="img"
            aria-label={`Macro distribution: Protein ${protein.toFixed(1)}%, Carbs ${carbs.toFixed(1)}%, Fat ${fat.toFixed(1)}%`}
          />
          <div className="absolute inset-3.5 flex flex-col items-center justify-center rounded-full bg-card text-center">
            <span className="text-lg font-bold text-white">
              {totalCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted">total kcal</span>
          </div>
        </div>

        <ul className="w-full space-y-2.5">
          <LegendItem
            label="Protein"
            percentage={protein}
            color={macroColors.protein}
          />
          <LegendItem
            label="Carbs"
            percentage={carbs}
            color={macroColors.carbs}
          />
          <LegendItem label="Fat" percentage={fat} color={macroColors.fat} />
        </ul>
      </div>
    </article>
  );
};

const LegendItem = ({ label, percentage, color }) => (
  <li className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-muted">{label}</span>
    </div>
    <span className="text-sm font-medium text-white">
      {percentage.toFixed(0)}%
    </span>
  </li>
);

export default MacroDistribution;
