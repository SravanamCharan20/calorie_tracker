import { getLocalDateKey } from "../../utils/dateUtils.js";

const WeeklyCaloriesChart = ({ weeklyCalories, calorieTarget }) => {
  const maxCalories = Math.max(
    ...weeklyCalories.map((day) => day.calories),
    calorieTarget || 0,
    1,
  );

  const todayKey = getLocalDateKey();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">Weekly calories</h3>
        <p className="mt-0.5 text-sm text-muted">
          Daily intake over the last 7 days
        </p>
      </div>

      <div className="flex flex-1 items-end justify-between gap-2 sm:gap-3">
        {weeklyCalories.map((day) => {
          const height = (day.calories / maxCalories) * 100;
          const isToday = day.date === todayKey;

          return (
            <div
              key={day.date}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <span className="text-[11px] font-medium text-muted">
                {day.calories > 0 ? day.calories : ""}
              </span>
              <div className="flex h-40 w-full items-end sm:h-44">
                <div
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                    isToday ? "bg-white" : "bg-card-elevated"
                  }`}
                  style={{
                    height: `${Math.max(height, day.calories > 0 ? 6 : 3)}%`,
                  }}
                  role="img"
                  aria-label={`${day.day}: ${day.calories} calories`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isToday ? "font-semibold text-white" : "text-muted"
                }`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      {calorieTarget > 0 && (
        <p className="mt-4 text-xs text-muted">
          Daily target: {calorieTarget.toLocaleString()} kcal
        </p>
      )}
    </article>
  );
};

export default WeeklyCaloriesChart;
