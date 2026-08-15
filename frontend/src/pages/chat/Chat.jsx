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
      <div className="flex h-full min-h-0 flex-1 flex-col">
        <section className="mb-3 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.12em] text-subtle uppercase">
                AI assistant
              </p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Chat
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                Hi {user?.username}, ask anything about your nutrition.
              </p>
            </div>

            {hasMessages && (
              <button
                type="button"
                disabled={isSending}
                onClick={() => setMessages([])}
                className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-white disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                Clear chat
              </button>
            )}
          </div>
        </section>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {!hasMessages ? (
              <div className="flex h-full min-h-0 items-center justify-center">
                <ChatWelcome
                  onSelectSuggestion={handleSendMessage}
                  disabled={isSending}
                />
              </div>
            ) : (
              <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInput onSend={handleSendMessage} disabled={isSending} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
