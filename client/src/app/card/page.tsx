"use client";

import "../shop/page.css";
import "./page.css";
import CardCard from "@/entities/card/ui/CardCard/CardCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { useEffect, useState } from "react";
import type { CardType } from "@/entities/card/model";

function lineItem(c: CardType) {
  return c.service ?? c.cremation ?? c.islamic ?? c.classicService;
}

function cardSearchText(card: CardType): string {
  const item = lineItem(card);
  const parts = [
    item?.name,
    item?.category,
    item?.description,
    String(card.id),
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export default function CardPage() {
  const dispatch = useAppDispatch();
  const { cards, isLoading, error } = useAppSelector((state) => state.card);
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    void dispatch(getAllCardsThunk());
  }, [dispatch, isInitialized, user, router]);

  const filteredCards = cards.filter((card) =>
    cardSearchText(card).includes(searchQuery.trim().toLowerCase()),
  );

  const totalPrice = cards.reduce(
    (acc, card) =>
      acc +
      Number(card.service?.price ?? 0) +
      Number(card.islamic?.price ?? 0) +
      Number(card.classicService?.price ?? 0) +
      Number(card.cremation?.price ?? 0),
    0,
  );

  const showCartContent = isInitialized && user;

  return (
    <section className="shop-page">
      <div className="shop-hero">
        <p className="shop-eyebrow">Корзина</p>
        <div className="shop-hero-grid">
          <div className="shop-hero-copy cart-hero-copy">
            <h1>Выбранные позиции</h1>
            <p>
              Здесь собраны услуги и товары, которые вы добавили. Перед
              оформлением проверьте состав — при необходимости вернитесь в
              каталог.
            </p>
          </div>
          <div className="shop-hero-mark">
            {/* eslint-disable-next-line @next/next/no-img-element -- внешняя иконка героя */}
            <img
              src="https://cdn-icons-png.flaticon.com/256/3144/3144456.png"
              alt="Корзина"
            />
          </div>
        </div>
      </div>

      {showCartContent && error ? (
        <div className="shop-form-wrap cart-message-wrap">
          <p className="shop-form-error" role="alert">
            {error}
          </p>
        </div>
      ) : null}

      {showCartContent ? (
        <div className="shop-filter-bar">
          <span className="shop-filter-label">Фильтрация</span>
          <input
            className="shop-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или категории"
            aria-label="Поиск позиций в корзине"
          />
        </div>
      ) : null}

      {!isInitialized ? (
        <p className="cart-panel-message">Проверка входа…</p>
      ) : null}

      {showCartContent && isLoading ? (
        <p className="cart-panel-message">Загрузка…</p>
      ) : null}

      {showCartContent && !isLoading && cards.length === 0 && !error ? (
        <p className="cart-panel-message">Корзина пуста.</p>
      ) : null}

      {showCartContent &&
      !isLoading &&
      filteredCards.length === 0 &&
      cards.length > 0 ? (
        <p className="cart-panel-message">Ничего не найдено по запросу.</p>
      ) : null}

      <div className="shop-grid">
        {showCartContent &&
          !isLoading &&
          filteredCards.map((card) => (
            <CardCard key={card.id} card={card} user={user} />
          ))}
      </div>

      {showCartContent && !isLoading && cards.length > 0 ? (
        <div className="cart-footer">
          <div className="cart-total">
            <div className="cart-total-copy">
              <span className="cart-total-label">Итого к оплате</span>
              <span className="cart-total-count">
                {cards.length}{" "}
                {cards.length === 1
                  ? "позиция"
                  : cards.length < 5
                    ? "позиции"
                    : "позиций"}
              </span>
            </div>
            <span className="cart-total-price">
              {totalPrice} ₽
            </span>
          </div>

          <div className="cart-actions">
            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() => router.push("/tarasAndYra")}
            >
              оформить заказ
            </button>
            <button
              type="button"
              className="shop-back-link cart-back-link"
              onClick={() => router.push("/home")}
            >
              Назад на главную
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="shop-back-link cart-back-link"
          onClick={() => router.push("/home")}
        >
          Назад на главную
        </button>
      )}
    </section>
  );
}
