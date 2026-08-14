import CaloriesHeroCard from "./CaloriesHeroCard";

const accentStyles = {
  protein: { bar: "bg-protein", dot: "bg-protein" },
  carbs: { bar: "bg-carbs", dot: "bg-carbs" },
  fat: { bar: "bg-fat", dot: "bg-fat" },
};

const NutritionCard = ({
  label,
  consumed,
  target,
  unit,
  percentage,
  remaining,
  type,
}) => {
  const styles = accentStyles[type];

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
          <p className="text-sm font-medium text-white">{label}</p>
        </div>
        <p className="text-sm text-muted">
          {consumed} / {target}
          {unit}
        </p>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-card-elevated">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${styles.bar}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.min(percentage, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} progress`}
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        {remaining}
        {unit} remaining
      </p>
    </article>
  );
};

const NutritionSummary = ({ nutritionTotals, nutritionProgress, goal }) => {
  if (!goal || !nutritionProgress) {
    return null;
  }

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="md:col-span-2 xl:col-span-2">
        <CaloriesHeroCard
          consumed={nutritionTotals.calories}
          target={goal.dailyCalorieTarget}
          remaining={nutritionProgress.caloriesRemaining}
          percentage={nutritionProgress.caloriePercentage}
        />
      </div>

      <NutritionCard
        label="Protein"
        consumed={nutritionTotals.protein}
        target={goal.proteinTarget}
        unit="g"
        percentage={nutritionProgress.proteinPercentage}
        remaining={nutritionProgress.proteinRemaining}
        type="protein"
      />

      <NutritionCard
        label="Carbs"
        consumed={nutritionTotals.carbs}
        target={goal.carbTarget}
        unit="g"
        percentage={nutritionProgress.carbPercentage}
        remaining={nutritionProgress.carbsRemaining}
        type="carbs"
      />

      <NutritionCard
        label="Fat"
        consumed={nutritionTotals.fat}
        target={goal.fatTarget}
        unit="g"
        percentage={nutritionProgress.fatPercentage}
        remaining={nutritionProgress.fatRemaining}
        type="fat"
      />
    </section>
  );
};

export default NutritionSummary;
