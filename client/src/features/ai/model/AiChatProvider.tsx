"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  AI_ASSISTANT_NAME,
  AI_WELCOME_MESSAGE,
  type ChatMessage,
} from "@/features/ai/model/types";

type AiChatContextType = {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  error: string;
  isLoading: boolean;
  sendMessage: () => Promise<void>;
};

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

export function useAiChat() {
  const context = useContext(AiChatContext);

  if (!context) {
    throw new Error("useAiChat должен использоваться внутри AiChatProvider");
  }

  return context;
}

export function AiChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([AI_WELCOME_MESSAGE]);
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

  useEffect(() => {
    setMessages([AI_WELCOME_MESSAGE]);
    setInput("");
    setError("");
    setIsLoading(false);
  }, [user?.id]);

  const sendMessage = useCallback(async () => {
    const message = input.trim();

    if (!message || !user) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      author: user.name || "Вы",
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
          userName: user.name,
          history: chatHistory,
        },
      );

      const reply =
        response.data?.answer?.trim() ||
        "Я рядом. Уточните, пожалуйста, ваш вопрос, и я постараюсь помочь.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        author: AI_ASSISTANT_NAME,
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI chat error:", err);
      setError("Не удалось получить ответ. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory, input, user]);

  const value = useMemo(
    () => ({
      messages,
      input,
      setInput,
      error,
      isLoading,
      sendMessage,
    }),
    [messages, input, error, isLoading, sendMessage],
  );

  return (
    <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>
  );
}
