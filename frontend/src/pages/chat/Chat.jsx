import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import { sendChatMessage } from "../../services/chatService.js";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import ChatWelcome from "../../components/chat/ChatWelcome.jsx";
import ChatMessage from "../../components/chat/ChatMessage.jsx";
import ChatInput from "../../components/chat/ChatInput.jsx";

const createMessage = (role, content, status) => ({
  id: crypto.randomUUID(),
  role,
  content,
  timestamp: new Date().toISOString(),
  ...(status ? { status } : {}),
});

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (text) => {
    const userMessage = createMessage("user", text);
    const loadingMessage = createMessage("assistant", "", "loading");

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsSending(true);

    try {
      const response = await sendChatMessage(text);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessage.id
            ? createMessage("assistant", response.response)
            : message,
        ),
      );
    } catch (error) {
      console.log("Chat send error:", error);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessage.id
            ? {
                ...createMessage(
                  "assistant",
                  error.message ||
                    "Something went wrong while generating the response.",
                ),
                status: "error",
              }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <DashboardLayout chatMode>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.04]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_55%)]"
            aria-hidden="true"
          />

          <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-card-elevated text-white">
                <SparkIcon />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium tracking-[0.14em] text-subtle uppercase">
                  AI assistant
                </p>
                <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                  Nutrition chat
                </h1>
                <p className="truncate text-sm text-muted">
                  Hi {user?.username}, ask anything about your nutrition.
                </p>
              </div>
            </div>

            {hasMessages && (
              <button
                type="button"
                disabled={isSending}
                onClick={() => setMessages([])}
                className="shrink-0 rounded-full border border-border bg-card-elevated/80 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-border-focus hover:text-white disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                Clear chat
              </button>
            )}
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {!hasMessages ? (
              <ChatWelcome
                onSelectSuggestion={handleSendMessage}
                disabled={isSending}
              />
            ) : (
              <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}
          </div>

          <ChatInput onSend={handleSendMessage} disabled={isSending} />
        </div>
      </div>
    </DashboardLayout>
  );
};

const SparkIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden="true"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
  </svg>
);

export default Chat;
