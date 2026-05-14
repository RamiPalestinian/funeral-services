"use client";

import "../shop/page.css";
import "./page.css";
import CardCard from "@/entities/card/ui/CardCard/CardCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { useEffect, useMemo, useState } from "react";
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    void dispatch(getAllCardsThunk());
  }, [dispatch]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((card) => cardSearchText(card).includes(q));
  }, [cards, searchQuery]);

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

      {error ? (
        <div className="shop-form-wrap cart-message-wrap">
          <p className="shop-form-error" role="alert">
            {error}
          </p>
        </div>
      ) : null}

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

      {isLoading ? (
        <p className="cart-panel-message">Загрузка…</p>
      ) : null}

      {!isLoading && cards.length === 0 && !error ? (
        <p className="cart-panel-message">Корзина пуста.</p>
      ) : null}

      {!isLoading && filteredCards.length === 0 && cards.length > 0 ? (
        <p className="cart-panel-message">Ничего не найдено по запросу.</p>
      ) : null}

      <div className="shop-grid">
        {!isLoading &&
          filteredCards.map((card) => <CardCard key={card.id} card={card} />)}
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
