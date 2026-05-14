"use client";

import "./page.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ShopCard from "@/entities/shop/ui/ShopCard/ShopCard";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  createShopThunk,
  getAllShopsThunk,
} from "@/entities/shop/api/ShopApiThunk";
import type { ShopType } from "@/entities/shop/model";
import { useUser } from "@/application/UserProvider";

export default function ShopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const shops = useAppSelector((state) => state.shop.shops);
  const isLoading = useAppSelector((state) => state.shop.isLoading);
  const error = useAppSelector((state) => state.shop.error);
  const { user } = useUser();
  const isAdmin = user?.id === 1;

  useEffect(() => {
    dispatch(getAllShopsThunk());
  }, [dispatch]);

  const handleCreateSubmit = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (user === null) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    await dispatch(
      createShopThunk({
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        image: String(formData.get("image")),
        category: String(formData.get("category")),
        status: String(formData.get("status")),
        userId: user.id,
      }),
    );
    event.currentTarget.reset();
  };

  return (
    <div>
      Магазин ритуальных товаров
      {isAdmin && (
        <form onSubmit={handleCreateSubmit}>
          <input type="hidden" name="status" value="В наличии" />
          <input
            name="name"
            type="text"
            placeholder="Название"
            minLength={3}
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Категория"
            minLength={3}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Цена"
            min={0}
            required
          />
          <input
            name="image"
            type="url"
            placeholder="Ссылка на изображение"
            required
          />
          <textarea
            name="description"
            placeholder="Описание"
            minLength={10}
            required
          />
          {error && <p>{error}</p>}
          <button type="submit" disabled={isLoading || !user}>
            Создать товар
          </button>
        </form>
      )}
      <div>
        {shops?.map((shop: ShopType) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
      <button
        type="button"
        className="shop-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </div>
  );
}
