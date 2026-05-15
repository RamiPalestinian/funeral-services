"use client";

import "./page.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ShopCard from "@/entities/shop/ui/ShopCard/ShopCard";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  createShopThunk,
  getAllShopsThunk,
} from "@/entities/shop/api/ShopApiThunk";
import type { ShopType } from "@/entities/shop/model";

export default function ShopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shops, error, isLoading } = useAppSelector((state) => state.shop);
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const isAdmin = user?.id === 1;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getAllShopsThunk());
  }, [dispatch]);

  const handleAddToCard = useCallback(
    async (serviceId: number) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      try {
        await dispatch(createCardThunk({ serviceId })).unwrap();
      } catch {
        console.log("Ошибка при добавлении в корзину");
      }
    },
    [user, router, dispatch],
  );

  const handleCreateSubmit = useCallback(
    async (event: React.ChangeEvent<HTMLFormElement>) => {
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
    },
    [user, dispatch],
  );

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth");
    }
  }, [isInitialized, user]);

  if (isInitialized && !user) {
    return null;
  }

  return (
    <section className="shop-page">
      <div className="shop-hero">
        <p className="shop-eyebrow">Ритуальный магазин</p>
        <div className="shop-hero-grid">
          <div className="shop-hero-copy">
            <h1>Товары для церемонии и памятного оформления</h1>
            <p>
              Подобрали венки, текстиль, урны, кресты и памятные принадлежности,
              которые помогают провести прощание спокойно, достойно и без лишней
              спешки.
            </p>
          </div>
          <div className="shop-hero-mark">
            <img
              src="https://cdn-icons-png.flaticon.com/256/3144/3144456.png"
              alt="Ритуальные товары"
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="shop-form-wrap">
          <form className="shop-form" onSubmit={handleCreateSubmit}>
            <input type="hidden" name="status" value="В наличии" />
            <input
              className="shop-form-input"
              name="name"
              type="text"
              placeholder="Название"
              minLength={3}
              required
            />
            <input
              className="shop-form-input"
              name="category"
              type="text"
              placeholder="Категория"
              minLength={3}
              required
            />
            <input
              className="shop-form-input"
              name="price"
              type="number"
              placeholder="Цена"
              min={0}
              required
            />
            <input
              className="shop-form-input shop-form-input-wide"
              name="image"
              type="url"
              placeholder="Добавить фото"
              required
            />
            <textarea
              className="shop-form-textarea"
              name="description"
              placeholder="Описание"
              minLength={10}
              required
            />
            <button
              className="shop-form-button"
              type="submit"
              disabled={!user || isLoading}
            >
              {isLoading ? "Создание..." : "Создать товар"}
            </button>
          </form>
          {error && <p className="shop-form-error">{error}</p>}
        </div>
      )}

      <div className="shop-filter-bar">
        <span className="shop-filter-label">Фильтрация</span>
        <input
          className="shop-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию"
          aria-label="Поиск товаров по названию"
        />
      </div>

      <div className="shop-grid">
        {filteredShops.map((shop: ShopType) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onAddToCard={() => void handleAddToCard(shop.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="shop-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
