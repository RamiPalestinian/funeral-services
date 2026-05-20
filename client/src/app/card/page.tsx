"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "../shop/page.css";
import "./page.css";
import CardCard from "@/entities/card/ui/CardCard/CardCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { useEffect } from "react";
import type { CardType } from "@/entities/card/model";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";

export default function CardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cards, isLoading, error } = useAppSelector((state) => state.card);
  const { isReady } = useRequireAuth();

  useEffect(() => {
    if (!isReady) return;
    void dispatch(getAllCardsThunk());
  }, [dispatch, isReady]);

  const ready = isReady;
  const isInitialLoading = isLoading && cards.length === 0;

  function lineItem(card: CardType) {
    return (
      card.service ?? card.cremation ?? card.islamic ?? card.classicService
    );
  }

  function positionsLabel(count: number): string {
    if (count === 1) return "позиция";
    if (count < 5) return "позиции";
    return "позиций";
  }

  const totalPrice = cards.reduce(
    (sum, card) => sum + Number(lineItem(card)?.price ?? 0),
    0,
  );

  return (
    <section className="shop-page">
      <div className="shop-hero">
        <p className="shop-eyebrow">Корзина</p>
        <div className="shop-hero-copy">
          <h1>Выбранные позиции</h1>
          <p>Услуги и товары, которые вы добавили в заказ.</p>
        </div>
      </div>

      {ready && isInitialLoading ? (
        <p className="cart-panel-message">Загрузка…</p>
      ) : null}

      {ready && !isInitialLoading && !error && cards.length === 0 ? (
        <p className="cart-panel-message">Корзина пуста.</p>
      ) : null}

      {ready && cards.length > 0 ? (
        <>
          <div className="shop-grid">
            {cards.map((card) => (
              <CardCard key={card.id} card={card} />
            ))}
          </div>
          <div>
            <div className="cart-total">
              <div className="cart-total-copy">
                <span className="cart-total-label">Итого к оплате</span>
                <span className="cart-total-count">
                  {cards.length} {positionsLabel(cards.length)}
                </span>
              </div>
              <span className="cart-total-price">
                {formatPriceRUB(totalPrice)} ₽
              </span>
            </div>
            <div className="cart-actions">
              <button
                type="button"
                className="cart-checkout-btn"
                onClick={() => router.push(CLIENT_ROUTES.CHECKOUT)}
              >
                Оформить заказ
              </button>
              <button
                type="button"
                className="shop-back-link cart-back-link"
                onClick={() => router.push(CLIENT_ROUTES.HOME)}
              >
                Назад на главную
              </button>
            </div>
          </div>
        </>
      ) : ready && !isInitialLoading ? (
        <button
          type="button"
          className="shop-back-link cart-back-link"
          onClick={() => router.push(CLIENT_ROUTES.HOME)}
        >
          Назад на главную
        </button>
      ) : null}
    </section>
  );
}
