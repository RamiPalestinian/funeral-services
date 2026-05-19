"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "./page.css";
import "../../shop/page.css";
import "../../card/page.css";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useEffect } from "react";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import { PaymentQr } from "@/shared/ui/PaymentQr/PaymentQr";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { lastCheckout } = useAppSelector((state) => state.card);

  useEffect(() => {
    if (!lastCheckout) {
      router.replace(CLIENT_ROUTES.CARD);
    }
  }, [lastCheckout, router]);

  if (!lastCheckout) {
    return <p className="cart-panel-message">Загрузка…</p>;
  }

  const details = `Оплачено ${lastCheckout.items} позиций на сумму ${formatPriceRUB(lastCheckout.total)} ₽`;

  return (
    <section className="shop-page checkout-page checkout-success-page">
      <div className="shop-hero">
        <p className="shop-eyebrow">Готово</p>
      </div>

      <div className="checkout-success-card">
        <span className="checkout-success-icon" aria-hidden>
          ✓
        </span>
        <p className="checkout-success-lead">Заказ оформлен</p>
        <h1>Оплата прошла успешно</h1>
        <p className="checkout-success-details">{details}</p>

        <PaymentQr title="Чек оплаты" hint="Отсканируйте QR-код" />

        <div className="checkout-success-actions">
          <button
            type="button"
            className="cart-checkout-btn"
            onClick={() => router.push(CLIENT_ROUTES.HOME)}
          >
            На главную
          </button>
          <button
            type="button"
            className="shop-back-link"
            onClick={() => router.push(CLIENT_ROUTES.SHOP)}
          >
            В каталог
          </button>
        </div>
      </div>
      <button
        type="button"
        className="checkout-success-mentor-link"
        onClick={() => router.push(CLIENT_ROUTES.TARAS_AND_YRA)}
      >
        благодарность
      </button>
    </section>
  );
}
