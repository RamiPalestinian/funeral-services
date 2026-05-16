"use client";

import "../../shop/page.css";
import "../page.css";
import "./page.css";
import "@/entities/cremation/ui/CremationCard/CremationCard.css";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  deleteCardThunk,
  getCardByIdThunk,
} from "@/entities/card/api/CardApiThunk";
import type { CardType } from "@/entities/card/model";

export default function CardByIdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const { cards } = useAppSelector((state) => state.card);
  const { user, isInitialized } = useAppSelector((state) => state.user);

  function lineKind(card: CardType): string {
    if (card.service) return "Товар (магазин)";
    if (card.cremation) return "Кремация";
    if (card.islamic) return "Исламская услуга";
    if (card.classicService) return "Классическая услуга";
    return "Позиция";
  }

  const card = cards.find((c) => c.id === numericId);
  const item = card
    ? (card.service ?? card.cremation ?? card.islamic ?? card.classicService)
    : null;
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

  return (
    <section className="shop-page card-item-detail-page">
      <div className="card-item-detail-media">
        {item?.image ? (
          <img
            className="card-item-detail-image"
            src={item.image}
            alt={item.name}
            width={400}
            height={300}
          />
        ) : (
          <div
            className="card-item-detail-image card-item-detail-image--empty"
            aria-hidden
          />
        )}
      </div>
      <div className="card-item-detail-body">
        <p className="card-item-detail-eyebrow">
          {card ? lineKind(card) : "Позиция"}
        </p>
        <h1 className="card-item-detail-title">
          {item ? item.name : card ? "Позиция #" + String(card.id) : "Позиция"}
        </h1>
        {item ? (
          <>
            <p className="card-item-detail-description">{item.description}</p>
            <div className="card-item-detail-meta">
              <span>{item.price} ₽</span>
              {item.category ? <span>{item.category}</span> : null}
            </div>
          </>
        ) : (
          <p className="card-item-detail-description">
            Данные позиции не загружены.
          </p>
        )}
        <div className="card-item-detail-actions">
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
