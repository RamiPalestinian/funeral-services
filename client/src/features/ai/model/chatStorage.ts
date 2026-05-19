import { AI_WELCOME_MESSAGE, type ChatMessage } from "@/features/ai/model/types";

const STORAGE_KEY_PREFIX = "ai-chat-messages";

function getStorageKey(userId: number) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export function loadChatMessages(userId: number): ChatMessage[] {
  if (typeof window === "undefined") {
    return [AI_WELCOME_MESSAGE];
  }

  try {
    const raw = sessionStorage.getItem(getStorageKey(userId));

    if (!raw) {
      return [AI_WELCOME_MESSAGE];
    }

    const parsed = JSON.parse(raw) as ChatMessage[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [AI_WELCOME_MESSAGE];
    }

    return parsed;
  } catch {
    return [AI_WELCOME_MESSAGE];
  }
}

export function saveChatMessages(userId: number, messages: ChatMessage[]) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(getStorageKey(userId), JSON.stringify(messages));
}

export function clearChatMessages(userId: number) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(getStorageKey(userId));
}
