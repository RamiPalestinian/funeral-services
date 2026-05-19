"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

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
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shopSchema,
  ShopSchema,
  ShopFormInput,
} from "@/entities/shop/model/shopSchema";

export default function ShopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { shops, error } = useAppSelector((state) => state.shop);
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const isAdmin = user?.id === 1;
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormInput, unknown, ShopSchema>({
    resolver: zodResolver(shopSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      userId: 1,
    },
  });

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getAllShopsThunk());
  }, [dispatch]);

  const handleAddToCard = useCallback(
    async (serviceId: number) => {
      if (!user) {
        router.push(CLIENT_ROUTES.AUTH);
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

  const onSubmit: SubmitHandler<ShopSchema> = useCallback(
    async (data) => {
      try {
        await dispatch(createShopThunk(data)).unwrap();
        reset();
      } catch (error) {
        console.error("Ошибка при создании магазина:", error);
      }
    },
    [dispatch, reset],
  );

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(CLIENT_ROUTES.AUTH);
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
          <form className="shop-form" onSubmit={handleSubmit(onSubmit)}>
            <input
              className="shop-form-input"
              {...register("name")}
              type="text"
              placeholder="Название"
              minLength={3}
              required
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
            <input
              className="shop-form-input"
              {...register("category")}
              type="text"
              placeholder="Категория"
              minLength={3}
              required
            />
            {errors.category && (
              <p className="error">{errors.category.message}</p>
            )}
            <input
              className="shop-form-input"
              {...register("price")}
              type="number"
              placeholder="Цена"
              min={0}
              required
            />
            {errors.price && <p className="error">{errors.price.message}</p>}
            <input
              className="shop-form-input shop-form-input-wide"
              {...register("image")}
              type="url"
              placeholder="Добавить фото"
              required
            />
            {errors.image && <p className="error">{errors.image.message}</p>}
            <textarea
              className="shop-form-textarea"
              {...register("description")}
              placeholder="Описание"
              minLength={10}
              required
            />
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
            <button
              className="shop-form-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Создать товар"}
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
        onClick={() => router.push(CLIENT_ROUTES.HOME)}
      >
        Назад на главную
      </button>
    </section>
  );
}
