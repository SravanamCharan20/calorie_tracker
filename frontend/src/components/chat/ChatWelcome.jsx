const suggestions = [
  {
    label: "Log 2 eggs for breakfast",
    hint: "Quick meal logging",
  },
  {
    label: "What are my calorie goals?",
    hint: "Check your targets",
  },
  {
    label: "Summarize my meals this week",
    hint: "Weekly overview",
  },
  {
    label: "How much protein did I eat today?",
    hint: "Daily nutrition",
  },
];

const ChatWelcome = ({ onSelectSuggestion, disabled }) => (
  <div className="flex min-h-full flex-col justify-between px-4 py-8 sm:px-8 sm:py-10">
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center">
      <div className="relative">
        <div
          className="absolute inset-0 scale-150 rounded-full bg-white/5 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl border border-border bg-card-elevated text-white shadow-[0_0_40px_rgba(0,0,0,0.25)]">
          <SparkIcon />
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
        Nutrition assistant
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Ask nutrition questions, log meals in natural language, check your goals,
        or get a weekly summary — all in one place.
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map(({ label, hint }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSuggestion(label)}
            className="group rounded-2xl border border-border/80 bg-card-elevated/70 px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-border-focus hover:bg-card-elevated disabled:opacity-50"
          >
            <span className="block text-sm font-medium text-white transition-colors group-hover:text-white">
              {label}
            </span>
            <span className="mt-1 block text-xs text-subtle">{hint}</span>
          </button>
        ))}
      </div>
    </div>

    <p className="mx-auto mt-8 max-w-md text-center text-xs text-subtle">
      Try a suggestion above or type your own question below.
    </p>
  </div>
);

const SparkIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden="true"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
  </svg>
);

export default ChatWelcome;
