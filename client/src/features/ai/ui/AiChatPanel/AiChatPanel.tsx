"use client";

import Link from "next/link";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import { useAiChat } from "@/features/ai/model/AiChatProvider";
import { AI_ASSISTANT_NAME } from "@/features/ai/model/types";
import "./AiChatPanel.css";

type AiChatPanelProps = {
  variant?: "page" | "widget";
  className?: string;
};

export default function AiChatPanel({
  variant = "page",
  className = "",
}: AiChatPanelProps) {
  const { user } = useAppSelector((state) => state.user);
  const { messages, input, setInput, error, isLoading, sendMessage, clearChat } =
    useAiChat();

  const hasDialog =
    messages.some((message) => message.id !== "assistant-welcome");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage();
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!isLoading && input.trim() && user) {
        void sendMessage();
      }
    }
  }

  const panelClassName = [
    "ai-chat-panel",
    variant === "widget" ? "ai-chat-panel--widget" : "ai-chat-panel--page",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={panelClassName}>
      {user && hasDialog && (
        <div className="ai-chat-toolbar">
          <button
            type="button"
            className="ai-chat-clear"
            onClick={clearChat}
            disabled={isLoading}
          >
            Очистить диалог
          </button>
        </div>
      )}

      <div className="ai-chat-messages">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`ai-chat-message ai-chat-message-${message.role}${
              message.id === "assistant-welcome" ? " ai-chat-message-welcome" : ""
            }`}
          >
            <span className="ai-chat-author">{message.author}</span>
            <p>{message.content}</p>
          </article>
        ))}

        {isLoading && (
          <article className="ai-chat-message ai-chat-message-assistant">
            <span className="ai-chat-author">{AI_ASSISTANT_NAME}</span>
            <p>Печатает ответ...</p>
          </article>
        )}
      </div>

      {!user ? (
        <p className="ai-chat-auth-hint">
          Чтобы написать помощнику,{" "}
          <Link href={CLIENT_ROUTES.AUTH}>войдите в аккаунт</Link>.
        </p>
      ) : (
        <form className="ai-chat-form" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Напишите ваш вопрос"
            rows={variant === "widget" ? 2 : 3}
            disabled={isLoading}
          />
          <div className="ai-chat-form-row">
            {error ? <p className="ai-chat-error">{error}</p> : <span />}
            <button type="submit" disabled={isLoading || !input.trim()}>
              Отправить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
