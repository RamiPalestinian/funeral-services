"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "../shop/page.css";
import "../card/page.css";
import "./page.css";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { useAppSelector, useAppDispatch } from "@/shared/hooks/useReduxHooks";
import {
  mockCheckoutThunk,
  getAllCardsThunk,
} from "@/entities/card/api/CardApiThunk";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardType } from "@/entities/card/model";
import { PaymentQr } from "@/shared/ui/PaymentQr/PaymentQr";
import { PaymentCardForm } from "@/shared/ui/PaymentCardForm/PaymentCardForm";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { lastCheckout, cards, isLoading, error } = useAppSelector(
    (state) => state.card,
  );
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isCardFormValid, setIsCardFormValid] = useState(false);
  const [isCashOrderModalOpen, setIsCashOrderModalOpen] = useState(false);
  const router = useRouter();

  function lineItem(card: CardType) {
    return (
      card.service ?? card.cremation ?? card.islamic ?? card.classicService
    );
  }

  function linePrice(card: CardType): number {
    return Number(lineItem(card)?.price ?? 0);
  }

  function cartTotal(cards: CardType[]) {
    return cards.reduce(
      (acc, card) => acc + Number(lineItem(card)?.price ?? 0),
      0,
    );
  }

  const PAYMENT_OPTIONS = [
    {
      id: "card",
      title: "Банковская карта",
      description: "Оплата банковской картой",
    },
    {
      id: "sbp",
      title: "СБП",
      description: "Быстрый перевод по QR",
    },
    {
      id: "cash",
      title: "При встречи",
      description: "Оплата наличными",
    },
  ];

  const totalPrice = cartTotal(cards);

  const payMessage = lastCheckout
    ? `${lastCheckout.message}. Оплачено ${lastCheckout.items} позиций на сумму ${formatPriceRUB(lastCheckout.total)} ₽`
    : null;

  const handlePay = useCallback(async () => {
    if (paymentMethod === "cash") {
      setIsCashOrderModalOpen(true);
      return;
    }

    try {
      await dispatch(mockCheckoutThunk()).unwrap();
      router.push(CLIENT_ROUTES.CHECKOUT_SUCCESS);
    } catch (error) {
      console.error("Ошибка при оплате:", error);
    }
  }, [dispatch, paymentMethod, router]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace(CLIENT_ROUTES.AUTH);
      return;
    }
    void dispatch(getAllCardsThunk());
  }, [dispatch, isInitialized, user, router]);

  function handlePaymentMethodChange(method: string) {
    setPaymentMethod(method);
    if (method !== "cash") {
      setIsCashOrderModalOpen(false);
    }
  }

  return (
    <section className="shop-page checkout-page">
      <div className="shop-hero">
        <p className="shop-eyebrow">Оформление</p>
        <div className="shop-hero-grid">
          <div className="shop-hero-copy">
            <h1>Способ оплаты</h1>
            <p>Выберите способ и подтвердите заказ.</p>
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
      {payMessage ? (
        <div className="shop-form-wrap cart-message-wrap">
          <p className="cart-panel-message">{payMessage}</p>
        </div>
      ) : null}
      <div className="checkout-layout">
        <div className="checkout-summary">
          <h2 className="checkout-block-title">Ваш заказ</h2>
          <ul className="checkout-items">
            {cards.map((card) => {
              const item = lineItem(card);
              if (!item) return null;
              return (
                <li key={card.id} className="checkout-item">
                  <span>{item.name}</span>
                  <span>{formatPriceRUB(linePrice(card))} ₽</span>
                </li>
              );
            })}
          </ul>
          <div className="cart-total">
            <div className="cart-total-copy">
              <span className="cart-total-label">Итого</span>
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
              {formatPriceRUB(totalPrice)} ₽
            </span>
          </div>
          <p className="checkout-selected">
            Выбрано:{" "}
            {PAYMENT_OPTIONS.find((o) => o.id === paymentMethod)?.title ?? "—"}
          </p>
        </div>
        <div className="checkout-methods">
          <h2 className="checkout-block-title">Оплата</h2>
          <div className="checkout-method-list" role="radiogroup">
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`checkout-method-card${
                  paymentMethod === option.id
                    ? " checkout-method-card--active"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={() => handlePaymentMethodChange(option.id)}
                />
                <span className="checkout-method-text">
                  <span className="checkout-method-title">{option.title}</span>
                  <span className="checkout-method-desc">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {paymentMethod === "card" ? (
            <PaymentCardForm onValidityChange={setIsCardFormValid} />
          ) : null}
          {paymentMethod === "sbp" ? (
            <PaymentQr
              title="Оплата по СБП"
              hint="Отсканируйте QR, затем нажмите «Оплатить»"
            />
          ) : null}
          <div className="cart-actions">
            <button
              type="button"
              className="cart-checkout-btn"
              disabled={
                isLoading ||
                cards.length === 0 ||
                (paymentMethod === "card" && !isCardFormValid)
              }
              onClick={() => void handlePay()}
            >
              Оплатить
            </button>
            <button
              type="button"
              className="shop-back-link cart-back-link"
              onClick={() => router.push(CLIENT_ROUTES.CARD)}
            >
              Назад в корзину
            </button>
          </div>
        </div>
      </div>

      {isCashOrderModalOpen && paymentMethod === "cash" ? (
        <div
          className="checkout-cash-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cash-order-title"
        >
          <button
            type="button"
            className="checkout-cash-modal__backdrop"
            aria-label="Закрыть"
            onClick={() => setIsCashOrderModalOpen(false)}
          />
          <div className="checkout-cash-modal__panel">
            <h2 id="cash-order-title" className="checkout-cash-modal__title">
              Заказ к оплате наличными
            </h2>
            <p className="checkout-cash-modal__lead">
              Оплатите при встрече. Онлайн-оплата не выполняется.
            </p>
            <ul className="checkout-items checkout-cash-modal__items">
              {cards.map((card) => {
                const item = lineItem(card);
                if (!item) return null;
                return (
                  <li key={card.id} className="checkout-item">
                    <span>{item.name}</span>
                    <span>{formatPriceRUB(linePrice(card))} ₽</span>
                  </li>
                );
              })}
            </ul>
            <p className="checkout-cash-modal__total">
              Итого: <strong>{formatPriceRUB(totalPrice)} ₽</strong>
            </p>
            <button
              type="button"
              className="cart-checkout-btn checkout-cash-modal__close"
              onClick={() => setIsCashOrderModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
