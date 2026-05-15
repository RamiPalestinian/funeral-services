"use client";

import "./IslamicCard.css";
import { deleteIslamicThunk } from "@/entities/islamic/api/IslamicApiThunk";
import type { IslamicType } from "@/entities/islamic/model";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";

type IslamicCardProps = {
  islamic: IslamicType | null;
  onAddToCard: () => void;
};

function IslamicCard({ islamic, onAddToCard }: IslamicCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const isAdmin = user?.id === 1;

  if (!islamic) {
    return null; // или можно отобразить заглушку, если данных нет
  }
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(islamic.price);

  const formatDate = useMemo(() => {
    if (!islamic) return "Дата не указана";
    if (!islamic.createdAt) return "Дата не указана";
    return new Date(islamic.createdAt).toLocaleString("ru-RU");
  }, [islamic]);

  const handleDelete = useCallback(() => {
    void dispatch(deleteIslamicThunk(islamic.id));
  }, [dispatch, islamic.id]);

  return (
    <article className="islamic-card">
      <small className="islamic-card-date">Добавлено: {formatDate}</small>
      <div className="islamic-card-media">
        <img
          className="islamic-card-image"
          src={islamic.image}
          alt={islamic.name}
          width={400}
          height={300}
        />
      </div>
      <div className="islamic-card-body">
        <p className="islamic-card-kicker">{islamic.category || "Ислам"}</p>
        <h4 className="islamic-card-title">{islamic.name}</h4>
        <p className="islamic-card-description">{islamic.description}</p>
        <div className="islamic-card-meta">
          <span className="islamic-card-price">{formattedPrice} ₽</span>
          {/* <span className="islamic-card-status">{islamic.status}</span> */}
        </div>
        <div className="islamic-card-actions">
          <button
            type="button"
            className="islamic-card-button"
            onClick={onAddToCard}
          >
            В корзину
          </button>
          <button
            className="islamic-card-button islamic-card-button-secondary"
            onClick={() => {
              router.push(`/islamic/${islamic.id}`);
            }}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="islamic-card-button islamic-card-button-danger"
              onClick={handleDelete}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </article>
  );
}   
export default React.memo(IslamicCard);