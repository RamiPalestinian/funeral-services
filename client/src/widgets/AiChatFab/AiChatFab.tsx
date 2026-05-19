"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AiChatPanel from "@/features/ai/ui/AiChatPanel/AiChatPanel";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import "./AiChatFab.css";

export default function AiChatFab() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isAiPage = pathname === CLIENT_ROUTES.AI;

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeChat]);

  useEffect(() => {
    closeChat();
  }, [pathname, closeChat]);

  if (isAiPage) {
    return null;
  }

  return (
    <div className="ai-chat-fab">
      {isOpen && (
        <>
          <button
            type="button"
            className="ai-chat-fab-overlay"
            aria-label="Закрыть чат"
            onClick={closeChat}
          />
          <div className="ai-chat-fab-panel" role="dialog" aria-label="Чат с ИИ-помощником">
            <div className="ai-chat-fab-header">
              <h2>ИИ-помощник</h2>
              <button
                type="button"
                className="ai-chat-fab-close"
                aria-label="Закрыть"
                onClick={closeChat}
              >
                ×
              </button>
            </div>
            <div className="ai-chat-fab-body">
              <AiChatPanel variant="widget" />
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        className={`ai-chat-fab-button${isOpen ? " ai-chat-fab-button--open" : ""}`}
        aria-label={isOpen ? "Закрыть чат с ИИ" : "Открыть чат с ИИ"}
        aria-expanded={isOpen}
        onClick={toggleChat}
      >
        <span className="ai-chat-fab-icon">{isOpen ? "×" : "Чат-бот"}</span>
      </button>
    </div>
  );
}
