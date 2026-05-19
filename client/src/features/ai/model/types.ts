export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  author: string;
  content: string;
};

export const AI_ASSISTANT_NAME = "Ваш личный помощник";

export const AI_WELCOME_MESSAGE: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  author: AI_ASSISTANT_NAME,
  content: "Я ваш личный помощник, чем могу помочь?",
};
