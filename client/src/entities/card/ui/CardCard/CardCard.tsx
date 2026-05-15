"use client";

import "./CardCard.css";
import type { CardType } from "../../model";
import { deleteCardThunk } from "../../api/CardApiThunk";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { UserType } from "@/entities/user/model";
import { CardDateMeta } from "@/shared/ui/CardDateMeta/CardDateMeta";
import React from "react";

type Props = { card: CardType; user: UserType };

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

function CardCard({ card, user }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const item = lineItem(card);
  const canRemove =
    user != null && card.userId != null && card.userId === user.id;

  return (
    <article className="card-line">
      <CardDateMeta createdAt={card.createdAt} />
      <div className="card-line-media">
        {item?.image ? (
          <img
            className="card-line-image"
            src={item.image}
            alt={item.name}
            width={400}
            height={300}
          />
        ) : (
          <div className="card-line-media-placeholder" aria-hidden />
        )}
      </div>
      <div className="card-line-body">
        <p className="card-line-kicker">{lineKind(card)}</p>
        <h4 className="card-line-title">
          {item ? item.name : "Позиция #" + String(card.id)}
        </h4>
        {item ? (
          <div className="card-line-detail">
            <p className="card-line-description">{item.description}</p>
            <div className="card-line-meta">
              <span className="card-line-price">{item.price} ₽</span>
              <span className="card-line-price">{item.category ?? "—"}</span>
            </div>
          </div>
        ) : (
          <p className="card-line-description">Нет данных по позиции.</p>
        )}
        <div className="card-line-actions">
          <button
            type="button"
            className="card-line-button card-line-button-secondary"
            onClick={() => router.push(`/card/${card.id}`)}
          >
            Подробнее
          </button>
          {canRemove ? (
            <button
              type="button"
              className="card-line-button card-line-button-delete"
              onClick={() => void dispatch(deleteCardThunk(card.id))}
            >
              Удалить из корзины
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default React.memo(CardCard);
