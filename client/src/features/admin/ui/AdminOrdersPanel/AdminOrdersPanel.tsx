"use client";

import { useEffect, useState } from "react";
import { fetchAdminOrders } from "@/entities/order/api/OrderApi";
import type { OrderType } from "@/entities/order/model";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import "./AdminOrdersPanel.css";

const PAYMENT_LABELS: Record<string, string> = {
  card: "Банковская карта",
  sbp: "СБП",
  cash: "При встрече",
};

const STATUS_LABELS: Record<string, string> = {
  paid: "Оплачен",
  awaiting_cash: "Ожидает оплаты",
  pending: "В обработке",
};

function formatFullName(user: OrderType["user"]) {
  if (!user) return "—";
  return [user.lastName, user.name, user.middleName].filter(Boolean).join(" ");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAdminOrders();
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить заказы");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="personal-section admin-orders">
      <div className="personal-section-head">
        <p className="personal-eyebrow">Администрирование</p>
        <h3>Управление заказами</h3>
        <p className="admin-orders__lead">
          Заказы пользователей: ФИО, телефон, город и состав заказа.
        </p>
      </div>

      {isLoading ? (
        <p className="admin-orders__status">Загрузка заказов…</p>
      ) : null}

      {error ? (
        <p className="admin-orders__error" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && orders.length === 0 ? (
        <p className="admin-orders__status">Пока нет заказов от пользователей.</p>
      ) : null}

      {!isLoading && !error && orders.length > 0 ? (
        <ul className="admin-orders__list">
          {orders.map((order) => (
            <li key={order.id} className="admin-orders__card">
              <div className="admin-orders__card-head">
                <div>
                  <p className="admin-orders__name">
                    {formatFullName(order.user)}
                  </p>
                  <p className="admin-orders__meta">
                    <span>{order.user?.phone || "Телефон не указан"}</span>
                    <span>{order.user?.city || "Город не указан"}</span>
                  </p>
                </div>
                <div className="admin-orders__summary">
                  <strong>{formatPriceRUB(Number(order.total))} ₽</strong>
                  <time dateTime={order.createdAt}>
                    {formatDate(order.createdAt)}
                  </time>
                </div>
              </div>

              <dl className="admin-orders__details">
                <div>
                  <dt>Оплата</dt>
                  <dd>
                    {PAYMENT_LABELS[order.paymentMethod] ??
                      order.paymentMethod}
                  </dd>
                </div>
                <div>
                  <dt>Статус</dt>
                  <dd>{STATUS_LABELS[order.status] ?? order.status}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{order.user?.email ?? "—"}</dd>
                </div>
              </dl>

              <ul className="admin-orders__items">
                {order.items.map((item, index) => (
                  <li key={`${order.id}-${index}`}>
                    <span>{item.name}</span>
                    <span>{formatPriceRUB(item.price)} ₽</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
