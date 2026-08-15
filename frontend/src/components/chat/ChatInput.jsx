import { useState } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-border bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-5"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="flex-1 rounded-2xl border border-border bg-card-elevated px-4 py-3 focus-within:border-border-focus">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder="Ask about meals, goals, or nutrition…"
            className="max-h-32 w-full resize-none bg-transparent text-sm leading-relaxed text-white placeholder:text-subtle outline-none disabled:opacity-50"
          />
          <p className="mt-2 text-[11px] text-subtle">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>

        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
};

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export default ChatInput;
