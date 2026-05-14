"use client";

import "./ShopCard.css";
import type { ShopType } from "../../model";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteShopThunk } from "../../api/ShopApiThunk";
import { useUser } from "@/application/UserProvider";

type ShopCardProps = {
  shop: ShopType;
};

export default function ShopCard({ shop }: ShopCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const isAdmin = user?.id === 1;
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(shop.price);

  const handleDelete = () => {
    dispatch(deleteShopThunk(Number(shop.id)));
  };

  return (
    <article className="shop-card">
      <div className="shop-card-media">
        <img
          className="shop-card-image"
          src={shop.image}
          alt={shop.name}
          width={400}
          height={300}
        />
      </div>
      <div className="shop-card-body">
        <p className="shop-card-kicker">{shop.category}</p>
        <h2 className="shop-card-title">{shop.name}</h2>
        <p className="shop-card-description">{shop.description}</p>
        <div className="shop-card-meta">
          <span className="shop-card-price">{formattedPrice} ₽</span>
          {/* <span className="shop-card-status">{shop.status}</span> */}
        </div>
        <div className="shop-card-actions">
          <button type="button" className="shop-card-button">
            Заказать
          </button>
          <button
            type="button"
            className="shop-card-button shop-card-button-secondary"
            onClick={() => router.push(`/shop/${shop.id}`)}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="shop-card-button shop-card-button-delete"
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
