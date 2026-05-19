"use client";

import "./ShopCard.css";
import type { ShopType } from "../../model";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteShopThunk } from "../../api/ShopApiThunk";
import { useUser } from "@/application/UserProvider";
import { CardDateMeta } from "@/shared/ui/CardDateMeta/CardDateMeta";
import ConfirmDialog from "@/shared/ui/ConfirmDialog/ConfirmDialog";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { shopDetailRoute } from "@/shared/consts/clientRouts";
import React, { useCallback, useState } from "react";

type ShopCardProps = {
  shop: ShopType;
  onAddToCard: () => void;
};

function ShopCard({ shop, onAddToCard }: ShopCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const isAdmin = user?.id === 1;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleConfirmDelete = useCallback(() => {
    void dispatch(deleteShopThunk(Number(shop.id)));
    setIsDeleteOpen(false);
  }, [dispatch, shop.id]);

  return (
    <article className="shop-card">
      <CardDateMeta createdAt={shop.createdAt} />
      <div className="shop-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="shop-card-image"
          src={shop.image}
          alt={shop.name}
          width={400}
          height={300}
        />
      </div>
      <div className="shop-card-body">
        <h2 className="shop-card-title">{shop.name}</h2>
        <p className="shop-card-description">{shop.description}</p>
        <div className="shop-card-meta">
          <span className="shop-card-category">{shop.category}</span>
          <span className="shop-card-price">{formatPriceRUB(shop.price)} ₽</span>
        </div>
        <div className="shop-card-actions">
          <button
            type="button"
            className="shop-card-button"
            onClick={onAddToCard}
          >
            В корзину
          </button>
          <button
            type="button"
            className="shop-card-button shop-card-button-secondary"
            onClick={() => router.push(shopDetailRoute(shop.id))}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="shop-card-button shop-card-button-delete"
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
        message={`«${shop.name}» будет удалена безвозвратно.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </article>
  );
}

export default React.memo(ShopCard);
