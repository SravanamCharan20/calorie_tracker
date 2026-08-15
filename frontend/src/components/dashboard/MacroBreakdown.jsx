import { useState } from "react";
import { getLocalDateKey } from "../../utils/dateUtils.js";

const macroColors = {
  protein: "#7a9e7e",
  carbs: "#c4a574",
  fat: "#7a8fa8",
};

const macroLabels = [
  { key: "protein", label: "Protein", color: macroColors.protein },
  { key: "carbs", label: "Carbs", color: macroColors.carbs },
  { key: "fat", label: "Fat", color: macroColors.fat },
];

const MacroBreakdown = ({
  dailyMacros,
  dailyPercentages,
  weeklyMacros,
}) => {
  const [view, setView] = useState("day");

  const dailyTotal =
    dailyMacros.protein + dailyMacros.carbs + dailyMacros.fat;

  const maxWeeklyTotal = Math.max(
    ...weeklyMacros.map(
      (day) => day.protein + day.carbs + day.fat,
    ),
    1,
  );

  const todayKey = getLocalDateKey();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Macro breakdown</h3>
          <p className="mt-0.5 text-sm text-muted">
            {view === "day"
              ? "Today's protein, carbs, and fat"
              : "Daily macros over the last 7 days"}
          </p>
        </div>

        <div className="flex rounded-xl border border-border bg-card-elevated p-1">
          <ViewToggle
            label="By day"
            active={view === "day"}
            onClick={() => setView("day")}
          />
          <ViewToggle
            label="By week"
            active={view === "week"}
            onClick={() => setView("week")}
          />
        </div>
      </div>

      {view === "day" ? (
        <div className="flex flex-1 flex-col justify-center gap-5">
          {macroLabels.map(({ key, label, color }) => {
            const grams = dailyMacros[key];
            const percentage = dailyPercentages[key];

            return (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-white">{label}</span>
                  </div>
                  <span className="text-muted">
                    {grams.toFixed(0)}g · {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-card-elevated">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${dailyTotal > 0 ? (grams / dailyTotal) * 100 : 0}%`,
                      backgroundColor: color,
                    }}
                    role="progressbar"
                    aria-valuenow={grams}
                    aria-valuemin={0}
                    aria-valuemax={dailyTotal}
                    aria-label={`${label}: ${grams}g`}
                  />
                </div>
              </div>
            );
          })}

          <p className="text-xs text-muted">
            Total macros: {dailyTotal.toFixed(0)}g logged today
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-end justify-between gap-2 sm:gap-3">
            {weeklyMacros.map((day) => {
              const dayTotal = day.protein + day.carbs + day.fat;
              const barHeight = (dayTotal / maxWeeklyTotal) * 100;
              const isToday = day.date === todayKey;

              const segments =
                dayTotal === 0
                  ? [{ color: "#2a2a2a", value: 100 }]
                  : [
                      {
                        color: macroColors.protein,
                        value: (day.protein / dayTotal) * 100,
                      },
                      {
                        color: macroColors.carbs,
                        value: (day.carbs / dayTotal) * 100,
                      },
                      {
                        color: macroColors.fat,
                        value: (day.fat / dayTotal) * 100,
                      },
                    ];

              return (
                <div
                  key={day.date}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <span className="text-[11px] font-medium text-muted">
                    {dayTotal > 0 ? `${dayTotal.toFixed(0)}g` : ""}
                  </span>
                  <div className="flex h-40 w-full items-end sm:h-44">
                    <div
                      className={`flex w-full flex-col-reverse overflow-hidden rounded-t-md transition-all duration-700 ease-out ${
                        isToday ? "ring-1 ring-white/20" : ""
                      }`}
                      style={{
                        height: `${Math.max(barHeight, dayTotal > 0 ? 8 : 3)}%`,
                      }}
                      role="img"
                      aria-label={`${day.day}: ${day.protein}g protein, ${day.carbs}g carbs, ${day.fat}g fat`}
                    >
                      {segments.map((segment, index) => (
                        <div
                          key={index}
                          style={{
                            height: `${segment.value}%`,
                            backgroundColor: segment.color,
                          }}
                        />
                      ))}
                    </div>
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

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {macroLabels.map(({ key, label, color }) => (
              <li key={key} className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

const ViewToggle = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-white text-black"
        : "text-muted hover:text-white"
    }`}
  >
    {label}
  </button>
);

export default MacroBreakdown;
