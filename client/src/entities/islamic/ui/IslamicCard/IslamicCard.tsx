"use client";

import "./IslamicCard.css";
import { deleteIslamicThunk } from "@/entities/islamic/api/IslamicApiThunk";
import type { IslamicType } from "@/entities/islamic/model";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";
import { CardDateMeta } from "@/shared/ui/CardDateMeta/CardDateMeta";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { islamicDetailRoute } from "@/shared/consts/clientRouts";
import React, { useCallback, useState } from "react";

type IslamicCardProps = {
  islamic: IslamicType | null;
  onAddToCard: () => void;
};

function IslamicCard({ islamic, onAddToCard }: IslamicCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const isAdmin = user?.id === 1;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!islamic) {
    return null;
  }

  const handleConfirmDelete = useCallback(() => {
    void dispatch(deleteIslamicThunk(islamic.id));
    setIsDeleteOpen(false);
  }, [dispatch, islamic.id]);

  return (
    <article className="islamic-card">
      <CardDateMeta createdAt={islamic.createdAt} />
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
        <h4 className="islamic-card-title">{islamic.name}</h4>
        <p className="islamic-card-description">{islamic.description}</p>
        <div className="islamic-card-meta">
          <span className="islamic-card-category">
            {islamic.category ?? "Ислам"}
          </span>
          <span className="islamic-card-price">
            {formatPriceRUB(islamic.price)} ₽
          </span>
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
            type="button"
            className="islamic-card-button islamic-card-button-secondary"
            onClick={() => {
              router.push(islamicDetailRoute(islamic.id));
            }}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="islamic-card-button islamic-card-button-danger"
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
        message={`«${islamic.name}» будет удалена безвозвратно.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </article>
  );
}

export default React.memo(IslamicCard);
