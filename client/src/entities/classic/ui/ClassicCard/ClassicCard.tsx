"use client";
import React from "react";
import "./ClassicCard.css";
import { deleteClassicThunk } from "@/entities/classic/api/ClassicApiThunk";
import type { ClassicType } from "@/entities/classic/model";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ClassicCardProps = {
  classic: ClassicType | null;
  onAddToCard: (id: number) => void;
};

function ClassicCard({ classic, onAddToCard }: ClassicCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const isAdmin = user?.id === 1;

  if (!classic) {
    return null; // или можно отобразить заглушку, если данных нет
  }

  const formattedPrice = new Intl.NumberFormat("ru-RU").format(classic.price);

  return (
    <article className="classic-card">
      {classic.createdAt ? (
        <p className="classic-card-added">
          <span className="classic-card-added-label">Добавлено</span>
          <time dateTime={classic.createdAt}>
            {new Date(classic.createdAt).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </p>
      ) : null}
      <div className="classic-card-media">
        <Image
          className="classic-card-image"
          src={classic.image}
          alt={classic.name}
          width={400}
          height={300}
        />
      </div>
      <div className="classic-card-body">
        <p className="classic-card-kicker">{classic.category || "Классика"}</p>
        <h4 className="classic-card-title">{classic.name}</h4>
        <p className="classic-card-description">{classic.description}</p>
        <div className="classic-card-meta">
          <span className="classic-card-price">{formattedPrice} ₽</span>
          {/* <span className="classic-card-status">{classic.status}</span> */}
        </div>
        <div className="classic-card-actions">
          <button
            type="button"
            className="classic-card-button"
            onClick={() => onAddToCard(classic.id)}
          >
            В корзину
          </button>
          <button
            className="classic-card-button classic-card-button-secondary"
            onClick={() => {
              router.push(`/classic/${classic.id}`);
            }}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              className="classic-card-button classic-card-button-delete"
              onClick={() => dispatch(deleteClassicThunk(classic.id))}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default React.memo(ClassicCard)
