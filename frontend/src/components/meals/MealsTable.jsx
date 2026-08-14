const formatMealType = (mealType) => {
  if (mealType === "snacks") return "Snack";
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
};

const formatDateLabel = (consumedAt) => {
  const date = new Date(consumedAt);
  const today = new Date();
  const isToday =
    date.toDateString() === today.toDateString();

  if (isToday) return "Today";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MealsTable = ({ meals, onEdit, onDelete }) => {
  if (meals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card-elevated px-6 py-16 text-center">
        <p className="text-sm font-medium text-white">No meals found</p>
        <p className="mt-1 text-sm text-muted">
          Try adjusting your filters or add a new meal.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="hidden grid-cols-[1fr_100px_80px_100px_80px] gap-4 border-b border-border px-6 py-3 text-[11px] font-medium tracking-[0.12em] text-subtle uppercase md:grid">
        <span>Meal</span>
        <span>Calories</span>
        <span>Protein</span>
        <span>Carbs / Fat</span>
        <span className="text-right">Actions</span>
      </div>

      <ul className="divide-y divide-border">
        {meals.map((meal) => (
          <li
            key={meal._id}
            className="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[1fr_100px_80px_100px_80px] md:items-center md:gap-4 md:px-6"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card-elevated text-muted">
                <MealIcon />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{meal.foodName}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {formatMealType(meal.mealType)} · {formatDateLabel(meal.consumedAt)} ·{" "}
                  {meal.quantity}g
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-white md:text-center">
              {meal.calories} kcal
            </p>
            <p className="text-sm text-white md:text-center">{meal.protein}g</p>
            <p className="text-sm text-white md:text-center">
              {meal.carbs}g / {meal.fat}g
            </p>

            <div className="flex items-center gap-2 md:justify-end">
              <button
                type="button"
                aria-label={`Edit ${meal.foodName}`}
                onClick={() => onEdit(meal)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-border-focus hover:text-white"
              >
                <EditIcon />
              </button>
              <button
                type="button"
                aria-label={`Delete ${meal.foodName}`}
                onClick={() => onDelete(meal)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-error hover:text-error"
              >
                <DeleteIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MealIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M6 3v8M10 3v8M6 11v10M10 11v10M14 3v18M18 3c1.5 0 3 1.5 3 4v4c0 2.5-1.5 4-3 4" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
);

export default MealsTable;
