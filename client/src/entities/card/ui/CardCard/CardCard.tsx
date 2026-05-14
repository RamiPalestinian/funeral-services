"use client";

import "./CardCard.css";
import type { CardType } from "../../model";
import { deleteCardThunk } from "../../api/CardApiThunk";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";

type Props = { card: CardType };

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

function formatRUB(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value ?? NaN);
  return Number.isFinite(n)
    ? `${new Intl.NumberFormat("ru-RU").format(n)} ₽`
    : "—";
}

function footerUserText(card: CardType): string {
  if (card.user?.name) return card.user.name;
  if (card.userId != null) return String(card.userId);
  return "—";
}

export default function CardCard({ card }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const item = lineItem(card);
  const userLine = footerUserText(card);
  const canRemove =
    user != null && card.userId != null && card.userId === user.id;

  return (
    <article className="card-line">
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
              <span className="card-line-price">{formatRUB(item.price)}</span>
              <span className="card-line-price">{item.category ?? "—"}</span>
            </div>
          </div>
        ) : (
          <p className="card-line-description">Нет данных по позиции.</p>
        )}
        <div className="card-line-meta card-line-meta--user">
          <span className="card-line-price">Пользователь: {userLine}</span>
        </div>
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
