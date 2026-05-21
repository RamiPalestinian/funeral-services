"use client";

import { useEffect, useState } from "react";
import { fetchAdminUsersWithCarts } from "@/entities/user/api/UserAdminApi";
import type { AdminUserWithCart } from "@/entities/user/model/admin";
import { formatPriceRUB } from "@/shared/lib/formatPriceRUB";
import "../AdminOrdersPanel/AdminOrdersPanel.css";
import "./AdminUsersPanel.css";

function formatFullName(user: AdminUserWithCart["user"]) {
  return [user.lastName, user.name, user.middleName].filter(Boolean).join(" ");
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function cartTotal(cart: AdminUserWithCart["cart"]) {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<AdminUserWithCart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAdminUsersWithCarts();
        if (!cancelled) setUsers(data);
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить список пользователей");
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
    <section className="personal-section admin-orders admin-users">
      <div className="personal-section-head">
        <p className="personal-eyebrow">Администрирование</p>
        <h3>Пользователи и корзины</h3>
        <p className="admin-orders__lead">
          Все зарегистрированные пользователи и позиции в их корзине.
        </p>
      </div>

      {isLoading ? (
        <p className="admin-orders__status">Загрузка пользователей…</p>
      ) : null}

      {error ? (
        <p className="admin-orders__error" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error && users.length === 0 ? (
        <p className="admin-orders__status">Нет зарегистрированных пользователей.</p>
      ) : null}

      {!isLoading && !error && users.length > 0 ? (
        <ul className="admin-orders__list admin-users__list">
          {users.map(({ user, cart }) => (
            <li key={user.id} className="admin-orders__card admin-users__card">
              <div className="admin-orders__card-head">
                <div>
                  <p className="admin-orders__name">
                    {formatFullName(user) || user.name}
                  </p>
                  <p className="admin-orders__meta">
                    <span>{user.phone || "Телефон не указан"}</span>
                    <span>{user.city || "Город не указан"}</span>
                  </p>
                </div>
                <div className="admin-orders__summary">
                  <strong>
                    {cart.length > 0
                      ? `${formatPriceRUB(cartTotal(cart))} ₽`
                      : "Корзина пуста"}
                  </strong>
                  <span className="admin-users__cart-count">
                    {cart.length}{" "}
                    {cart.length === 1
                      ? "позиция"
                      : cart.length >= 2 && cart.length <= 4
                        ? "позиции"
                        : "позиций"}
                  </span>
                </div>
              </div>

              <dl className="admin-orders__details">
                <div>
                  <dt>Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div>
                  <dt>Регистрация</dt>
                  <dd>
                    <time dateTime={user.createdAt}>{formatDate(user.createdAt)}</time>
                  </dd>
                </div>
              </dl>

              {cart.length > 0 ? (
                <ul className="admin-orders__items">
                  {cart.map((item) => (
                    <li key={item.cardId}>
                      <span>
                        {item.name}
                        {item.category ? (
                          <span className="admin-users__category">
                            {" "}
                            · {item.category}
                          </span>
                        ) : null}
                      </span>
                      <span>{formatPriceRUB(item.price)} ₽</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-users__empty-cart">В корзине нет товаров</p>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
