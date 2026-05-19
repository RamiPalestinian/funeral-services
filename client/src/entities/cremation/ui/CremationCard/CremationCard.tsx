"use client";

import "./CremationCard.css";
import type { CremationType } from "../../model";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteCremationThunk } from "../../api/CremationApiThunk";
import { useUser } from "@/application/UserProvider";
import { CardDateMeta } from "@/shared/ui/CardDateMeta/CardDateMeta";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { cremationDetailRoute } from "@/shared/consts/clientRouts";
import React, { useCallback, useState } from "react";

type CremationCardProps = {
  cremation: CremationType;
  onAddToCard: () => void;
};

function CremationCard({ cremation, onAddToCard }: CremationCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const isAdmin = user?.id === 1;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = useCallback(() => {
    void dispatch(deleteCremationThunk(Number(cremation.id)));
    setIsDeleteOpen(false);
  }, [dispatch, cremation.id]);

  return (
    <article className="cremation-card">
      <CardDateMeta createdAt={cremation.createdAt} />
      <div className="cremation-card-media">
        <img
          className="cremation-card-image"
          src={cremation.image}
          alt={cremation.name}
          width={400}
          height={300}
        />
      </div>
      <div className="cremation-card-body">
        <h2 className="cremation-card-title">{cremation.name}</h2>
        <p className="cremation-card-description">{cremation.description}</p>
        <div className="cremation-card-meta">
          <span className="cremation-card-category">{cremation.category}</span>
          <span className="cremation-card-price">
            {formatPriceRUB(cremation.price)} ₽
          </span>
        </div>
        <div className="cremation-card-actions">
          <button
            type="button"
            className="cremation-card-button"
            onClick={onAddToCard}
          >
            В корзину
          </button>
          <button
            type="button"
            className="cremation-card-button cremation-card-button-secondary"
            onClick={() => router.push(cremationDetailRoute(cremation.id))}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="cremation-card-button cremation-card-button-delete"
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
        message={`«${cremation.name}» будет удалена безвозвратно.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </article>
  );
}

export default React.memo(CremationCard);
