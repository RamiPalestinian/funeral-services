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

  const handleDelete = () => {
    dispatch(deleteShopThunk(Number(shop.id)));
  };

  return (
    <div>
      <img src={shop.image} alt={shop.name} />
      <h2>{shop.name}</h2>
      <p>{shop.description}</p>
      <p>{shop.price}</p>
      <p>{shop.category}</p>
      <button type="button">Заказать</button>
      <button
        type="button"
        onClick={() => router.push(`/shop/${shop.id}`)}
      >
        Подробнее
      </button>
      {isAdmin && (
        <button type="button" onClick={() => handleDelete()}>
          Удалить
        </button>
      )}
    </div>
  );
}
