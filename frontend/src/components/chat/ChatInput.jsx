import { useRef, useState } from "react";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = input.trim();

    if (disabled || (!trimmed && !imageFile)) {
      return;
    }

    onSend(trimmed || "Extract nutrition from this image.", imageFile);
    setInput("");
    setImageFile(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 shrink-0 border-t border-border/70 bg-card/95 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      {imageFile && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card-elevated px-3 py-2">
          <p className="truncate text-xs text-muted">{imageFile.name}</p>
          <button
            type="button"
            onClick={handleClearImage}
            disabled={disabled}
            className="shrink-0 text-xs text-subtle hover:text-white disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex min-h-[52px] flex-1 items-end gap-3 rounded-[1.35rem] border border-border bg-card-elevated px-4 py-3 shadow-inner shadow-black/20 transition-colors focus-within:border-border-focus focus-within:ring-1 focus-within:ring-white/10">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageSelect}
            disabled={disabled}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-border-focus hover:text-white disabled:opacity-40"
            aria-label="Attach food image"
          >
            <AttachIcon />
          </button>

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
            disabled={disabled || (!input.trim() && !imageFile)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-all hover:scale-105 hover:opacity-90 disabled:scale-100 disabled:opacity-40"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-subtle sm:text-left">
        {imageError || "Press Enter to send · Shift + Enter for a new line · Attach a food image to extract nutrition"}
      </p>
    </form>
  );
};

const AttachIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
  </svg>
);

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
