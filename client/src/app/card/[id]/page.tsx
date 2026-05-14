"use client";

import "../page.css";
import "../../cremation/page.css";
import "@/entities/cremation/ui/CremationCard/CremationCard.css";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  deleteCardThunk,
  getCardByIdThunk,
} from "@/entities/card/api/CardApiThunk";
import type { CardType } from "@/entities/card/model";

function lineItem(c: CardType) {
  return c.service ?? c.cremation ?? c.islamic ?? c.classicService;
}

function lineKind(c: CardType): string {
  if (c.service) return "Товар (магазин)";
  if (c.cremation) return "Кремация";
  if (c.islamic) return "Исламская услуга";
  if (c.classicService) return "Классическая услуга";
  return "Позиция";
}

export default function CardByIdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { cards, isLoading, error } = useAppSelector((state) => state.card);
  const user = useAppSelector((state) => state.user.user);
  const { isInitialized } = useAppSelector((state) => state.user);

  const card = cards.find((c) => c.id === numericId);
  const item = card ? lineItem(card) : null;
  const canRemove =
    user != null &&
    card != null &&
    card.userId != null &&
    card.userId === user.id;

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    if (Number.isFinite(numericId)) {
      void dispatch(getCardByIdThunk(numericId));
    }
  }, [dispatch, isInitialized, user, router, numericId]);

  if (!isInitialized) {
    return (
      <section className="card-page cremation-detail-page">
        <p className="cremation-detail-description">Проверка входа…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="card-page cremation-detail-page">
        <p className="cremation-detail-description">Нужен вход в аккаунт.</p>
      </section>
    );
  }

  if (!Number.isFinite(numericId)) {
    return (
      <section className="card-page cremation-detail-page">
        <p className="cremation-detail-description">
          Некорректный идентификатор.
        </p>
        <button
          type="button"
          className="cremation-card-button cremation-card-button-secondary"
          onClick={() => router.push("/card")}
        >
          К списку
        </button>
      </section>
    );
  }

  if (isLoading && !card) {
    return (
      <section className="card-page cremation-detail-page">
        <p className="cremation-detail-description">Загрузка…</p>
      </section>
    );
  }

  if (!card) {
    return (
      <section className="card-page cremation-detail-page">
        <p className="cremation-detail-description">
          {error ?? "Позиция не найдена."}
        </p>
        <button
          type="button"
          className="cremation-card-button cremation-card-button-secondary"
          onClick={() => router.push("/card")}
        >
          К списку
        </button>
      </section>
    );
  }

  return (
    <section className="card-page cremation-detail-page">
      <div className="cremation-detail-media">
        {item?.image ? (
          <img
            className="cremation-detail-image"
            src={item.image}
            alt={item.name}
            width={400}
            height={300}
          />
        ) : (
          <div
            className="cremation-detail-image"
            style={{
              minHeight: 200,
              background: "rgba(255,255,255,0.04)",
            }}
            aria-hidden
          />
        )}
      </div>
      <div className="cremation-detail-body">
        <p className="cremation-eyebrow">{lineKind(card)}</p>
        <h1 className="cremation-detail-title">
          {item ? item.name : "Позиция #" + String(card.id)}
        </h1>
        {item ? (
          <>
            <p className="cremation-detail-description">{item.description}</p>
            <div className="cremation-detail-meta">
              <span>
                {new Intl.NumberFormat("ru-RU").format(
                  typeof item.price === "number"
                    ? item.price
                    : Number(item.price),
                )}{" "}
                ₽
              </span>
              {item.category ? <span>{item.category}</span> : null}
            </div>
          </>
        ) : (
          <p className="cremation-detail-description">
            Данные позиции не загружены.
          </p>
        )}
        <div className="cremation-detail-actions">
          <button
            type="button"
            className="cremation-card-button cremation-card-button-secondary"
            onClick={() => router.back()}
          >
            Назад
          </button>
          {canRemove ? (
            <button
              type="button"
              className="cremation-card-button"
              onClick={() => {
                void (async () => {
                  try {
                    await dispatch(deleteCardThunk(card.id)).unwrap();
                    router.push("/card");
                  } catch {
                    console.log("Ошибка при удалении из корзины");
                  }
                })();
              }}
            >
              Удалить из корзины
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
