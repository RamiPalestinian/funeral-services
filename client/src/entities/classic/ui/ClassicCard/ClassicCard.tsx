"use client";
import React from "react";
import "./ClassicCard.css";
import { deleteClassicThunk } from "@/entities/classic/api/ClassicApiThunk";
import type { ClassicType } from "@/entities/classic/model";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { CardDateMeta } from "@/shared/ui/CardDateMeta/CardDateMeta";
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


  return (
    <article className="classic-card">
      <CardDateMeta createdAt={classic.createdAt} />
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
          <span className="classic-card-price">{classic.price} ₽</span>
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

export default React.memo(ClassicCard);
