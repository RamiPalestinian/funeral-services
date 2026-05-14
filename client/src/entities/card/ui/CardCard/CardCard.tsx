"use client";

import "./CardCard.css";
import type { CardType } from "../../model";

type CardCardProps = {
  card: CardType;
};

export default function CardCard({ card }: CardCardProps) {
  return (
    <article className="card-line">
      <h2 className="card-line-title">Позиция #{card.id}</h2>
      <dl className="card-line-meta">
        <div>
          <dt>Пользователь</dt>
          <dd>{card.userId ?? "—"}</dd>
        </div>
        <div>
          <dt>Услуга (магазин)</dt>
          <dd>{card.serviceId ?? "—"}</dd>
        </div>
        <div>
          <dt>Исламские</dt>
          <dd>{card.islamicId ?? "—"}</dd>
        </div>
        <div>
          <dt>Классические</dt>
          <dd>{card.classicServiceId ?? "—"}</dd>
        </div>
        <div>
          <dt>Кремация</dt>
          <dd>{card.cremationId ?? "—"}</dd>
        </div>
      </dl>
    </article>
  );
}
