import StructuredResponse from "./StructuredResponse.jsx";

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";
  const isLoading = message.status === "loading";
  const isError = message.status === "error";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[70%]">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-black">
            {message.content}
          </div>
          <p className="mt-1.5 text-right text-[11px] text-subtle">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card-elevated text-muted">
        <AssistantIcon />
      </div>

      <div className="min-w-0 flex-1 max-w-[85%] sm:max-w-[75%]">
        <article
          className={`rounded-2xl border px-4 py-3.5 sm:px-5 sm:py-4 ${
            isError
              ? "border-error/30 bg-error/10"
              : "border-border bg-card"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[11px] font-medium tracking-[0.12em] text-subtle uppercase">
              Nutrition assistant
            </span>
            {isLoading && (
              <span className="rounded-full bg-card-elevated px-2 py-0.5 text-[10px] font-medium text-muted">
                Thinking
              </span>
            )}
          </div>

          {isLoading ? (
            <TypingIndicator />
          ) : isError ? (
            <p className="text-sm leading-relaxed text-error">{message.content}</p>
          ) : (
            <StructuredResponse content={message.content} />
          )}
        </article>

        {!isLoading && (
          <p className="mt-1.5 text-[11px] text-subtle">
            {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 py-1" aria-label="Assistant is typing">
    {[0, 1, 2].map((dot) => (
      <span
        key={dot}
        className="h-2 w-2 animate-pulse rounded-full bg-muted"
        style={{ animationDelay: `${dot * 150}ms` }}
      />
    ))}
  </div>
);

const AssistantIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden="true"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19h14M8 19l1-4M16 19l-1-4" />
  </svg>
);

export default ChatMessage;
