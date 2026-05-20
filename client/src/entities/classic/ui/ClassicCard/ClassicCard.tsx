"use client";
import React from "react";
import "./ClassicCard.css";
import { deleteClassicThunk } from "@/entities/classic/api/ClassicApiThunk";
import type { ClassicType } from "@/entities/classic/model";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { useIsAdmin } from "@/shared/hooks/useIsAdmin";
import { useRouter } from "next/navigation";
import { CardDateMeta } from "@/shared/ui/CardDateMeta/CardDateMeta";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { classicDetailRoute } from "@/shared/consts/clientRouts";
import Image from "next/image";
import { useCallback, useState } from "react";

type ClassicCardProps = {
  classic: ClassicType | null;
  onAddToCard: (id: number) => void;
};

function ClassicCard({ classic, onAddToCard }: ClassicCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAdmin = useIsAdmin();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = useCallback(() => {
    if (!classic) {
      return;
    }

    void dispatch(deleteClassicThunk(classic.id));
    setIsDeleteOpen(false);
  }, [dispatch, classic]);

  if (!classic) {
    return null;
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
        <h4 className="classic-card-title">{classic.name}</h4>
        <p className="classic-card-description">{classic.description}</p>
        <div className="classic-card-meta">
          <span className="classic-card-category">
            {classic.category ?? "Классика"}
          </span>
          <span className="classic-card-price">{formatPriceRUB(classic.price)} ₽</span>
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
              router.push(classicDetailRoute(classic.id));
            }}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="classic-card-button classic-card-button-delete"
              onClick={() => setIsDeleteOpen(true)}
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Удалить услугу?"
        message={`«${classic.name}» будет удалена безвозвратно.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </article>
  );
}

export default React.memo(ClassicCard);
