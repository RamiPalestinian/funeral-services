"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import { useRouter } from "next/navigation";
import "./not-found.css";

export default function NotFoundPage() {
  const router = useRouter();

  // function handleBack() {
  //   if (window.history.length > 1) {
  //     router.back();
  //     return;
  //   }

  //   router.push(CLIENT_ROUTES.HOME);
  // }

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <p className="not-found-kicker">Нужной страницы нет</p>
        <h1>
          По этому адресу сейчас ничего нет, давайте вернёмся на понятный
          маршрут
        </h1>
        <p className="not-found-text">
          Такое бывает. Вернитесь назад или перейдите на главную, там будет
          проще начать заново и без лишних кругов.
        </p>
        <div className="not-found-divider" aria-hidden="true"></div>
        <div className="not-found-actions">
          <button className="back-button" onClick={() => router.replace(CLIENT_ROUTES.HOME)}>
            ← Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}
