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
      className="relative z-10 shrink-0 border-t border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="flex items-end gap-3">
        <div className="flex min-h-[52px] flex-1 items-end gap-3 rounded-[1.35rem] border border-border bg-card-elevated px-4 py-3 shadow-inner shadow-black/20 transition-colors focus-within:border-border-focus focus-within:ring-1 focus-within:ring-white/10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder="Ask about meals, goals, or nutrition…"
            className="max-h-32 min-h-[24px] w-full resize-none bg-transparent text-sm leading-relaxed text-white placeholder:text-subtle outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105 hover:opacity-90 disabled:scale-100 disabled:opacity-40"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-subtle sm:text-left">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};

const SendIcon = () => (
  <svg
    width="16"
    height="16"
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
