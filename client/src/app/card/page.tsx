"use client";

import "../shop/page.css";
import "./page.css";
import CardCard from "@/entities/card/ui/CardCard/CardCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { useEffect } from "react";
import type { CardType } from "@/entities/card/model";

export default function CardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cards, isLoading, error } = useAppSelector((state) => state.card);
  const { user, isInitialized } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/auth");
      return;
    }
    void dispatch(getAllCardsThunk());
  }, [dispatch, isInitialized, user, router]);

  const ready = isInitialized && user;

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

      {ready && !isLoading && !error && cards.length === 0 ? (
        <p className="cart-panel-message">Корзина пуста.</p>
      ) : null}

      {ready && !isLoading && cards.length > 0 ? (
        <>
          <div className="shop-grid">
            {cards.map((card) => (
              <CardCard key={card.id} card={card} user={user} />
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
                onClick={() => router.push("/checkout")}
              >
                Оформить заказ
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
        </>
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
