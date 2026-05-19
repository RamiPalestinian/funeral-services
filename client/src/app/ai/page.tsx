"use client";

import "./page.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import AiChatPanel from "@/features/ai/ui/AiChatPanel/AiChatPanel";

export default function AiPage() {
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth");
    }
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
