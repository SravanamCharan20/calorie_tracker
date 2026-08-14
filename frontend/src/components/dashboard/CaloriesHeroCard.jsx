const ProgressRing = ({ percentage, size = 80, stroke = 6 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e5e5e5"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#171717"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};

const CaloriesHeroCard = ({
  consumed,
  target,
  remaining,
  percentage,
}) => (
  <article className="flex h-full flex-col rounded-2xl bg-white p-6 text-black sm:p-7">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-neutral-500">Calories consumed</p>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-[42px]">
          {consumed.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          of {target.toLocaleString()} kcal target
        </p>
      </div>

      <div className="relative shrink-0">
        <ProgressRing percentage={percentage} />
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-black">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>

    <div className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-4 text-sm">
      <span className="text-neutral-600">
        {remaining.toLocaleString()} kcal remaining
      </span>
      <span className="font-medium text-neutral-900">
        {percentage.toFixed(1)}% of goal
      </span>
    </div>
  </article>
);

export default CaloriesHeroCard;
