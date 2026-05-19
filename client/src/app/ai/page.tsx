"use client";

import "./page.css";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import AiChatPanel from "@/features/ai/ui/AiChatPanel/AiChatPanel";

export default function AiPage() {
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const router = useRouter();

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
      const response = await axiosInstance.post<{ answer?: string }>(
        "/ai/send-message",
        {
          message,
          userName: user?.name,
          history: chatHistory,
        },
      );

      const reply =
        response.data?.answer?.trim() ||
        "Я рядом. Уточните, пожалуйста, ваш вопрос, и я постараюсь помочь.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        author: assistantName,
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

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth");
    }
  }, [isInitialized, router, user]);
  }, [isInitialized, user, router]);

  if (isInitialized && !user) {
    return null;
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
        <AiChatPanel variant="page" />
      </div>
    </section>
  );
}
