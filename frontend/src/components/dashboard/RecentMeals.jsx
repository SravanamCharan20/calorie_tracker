import EmptyState from "./EmptyState";

const formatMealTime = (consumedAt) => {
  return new Date(consumedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatMealType = (mealType) => {
  if (!mealType) return "Meal";
  if (mealType === "snacks") return "Snack";
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
};

const RecentMeals = ({ recentMeals }) => (
  <article className="rounded-2xl border border-border bg-card p-6 sm:p-7">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Recent meals</h3>
        <p className="mt-0.5 text-sm text-muted">Added today</p>
      </div>
    </div>

    {recentMeals.length === 0 ? (
      <EmptyState
        title="No meals added today"
        description="Log your first meal to start tracking today's nutrition."
      />
    ) : (
      <ul className="divide-y divide-border">
        {recentMeals.map((meal) => (
          <li
            key={meal.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card-elevated text-muted">
                <MealIcon />
              </div>
              <div>
                <p className="font-medium text-white">{meal.foodName}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {formatMealType(meal.mealType)} · {meal.quantity}g ·{" "}
                  {formatMealTime(meal.consumedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 sm:justify-end">
              <span className="text-sm font-semibold text-white">
                {meal.calories} kcal
              </span>
              <span className="hidden text-xs text-muted sm:inline">
                P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </article>
);

const MealIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden="true"
  >
    <path d="M6 3v8M10 3v8M6 11v10M10 11v10M14 3v18M18 3c1.5 0 3 1.5 3 4v4c0 2.5-1.5 4-3 4" />
  </svg>
);

export default RecentMeals;
