"use client";

import "./page.css";
import { useMemo, useState } from "react";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  author: string;
  content: string;
};

const assistantName = "Ваш личный помощник";

const initialMessages: ChatMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    author: assistantName,
    content: "Я ваш личный помощник, чем могу помочь?",
  },
];

export default function AiPage() {
  const user = useAppSelector((state) => state.user.user);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatHistory = useMemo(
    () =>
      messages
        .filter((message) => message.id !== "assistant-welcome")
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages],
  );

  async function sendMessage() {
    const message = input.trim();

    if (!message) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      author: user?.name || "Вы",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/ai/chat", {
        message,
        userName: user?.name,
        history: chatHistory,
      });

      const reply =
        response.data?.data?.reply ||
        "Я рядом. Уточните, пожалуйста, ваш вопрос, и я постараюсь помочь.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        author: response.data?.data?.assistantName || assistantName,
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI chat error:", err);
      setError("Не удалось получить ответ. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage();
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!isLoading && input.trim()) {
        void sendMessage();
      }
    }
  }

  return (
    <section className="support-chat-page">
      <div className="support-chat-hero">
        <p className="support-chat-kicker">Служба поддержки</p>
        <h1>Чат с личным помощником</h1>
        <p>
          Задайте вопрос по услугам, документам, стоимости или порядку действий.
          Помощник ответит спокойно и по существу.
        </p>
      </div>

      <div className="support-chat-shell">
        <div className="support-chat-messages">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`support-chat-message support-chat-message-${message.role}${
                message.id === "assistant-welcome"
                  ? " support-chat-message-welcome"
                  : ""
              }`}
            >
              <span className="support-chat-author">{message.author}</span>
              <p>{message.content}</p>
            </article>
          ))}

          {isLoading && (
            <article className="support-chat-message support-chat-message-assistant">
              <span className="support-chat-author">{assistantName}</span>
              <p>Печатает ответ...</p>
            </article>
          )}
        </div>

        <form className="support-chat-form" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Напишите ваш вопрос"
            rows={3}
          />
          <div className="support-chat-form-row">
            {error ? <p className="support-chat-error">{error}</p> : <span />}
            <button type="submit" disabled={isLoading || !input.trim()}>
              Отправить
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
