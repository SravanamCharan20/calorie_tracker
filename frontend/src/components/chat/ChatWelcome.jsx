const suggestions = [
  "Log 2 eggs for breakfast",
  "What are my calorie goals?",
  "Summarize my meals this week",
  "How much protein did I eat today?",
];

const ChatWelcome = ({ onSelectSuggestion, disabled }) => (
  <div className="flex w-full flex-col items-center justify-center px-4 py-6 text-center sm:py-8">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card-elevated text-white">
      <SparkIcon />
    </div>

    <h2 className="mt-5 text-xl font-semibold text-white">
      Nutrition assistant
    </h2>
    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
      Ask nutrition questions, log meals in natural language, check your goals,
      or get a weekly summary — all in one place.
    </p>

    <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          disabled={disabled}
          onClick={() => onSelectSuggestion(suggestion)}
          className="rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm text-muted transition-colors hover:border-border-focus hover:text-white disabled:opacity-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

const SparkIcon = () => (
  <svg
    width="22"
    height="22"
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
