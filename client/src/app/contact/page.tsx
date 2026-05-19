"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import "./page.css";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="contact-page">
      <button className="contact-back-link" onClick={() => router.push(CLIENT_ROUTES.HOME)}>
        Назад на главную
      </button>

      <section className="contact-hero">
        <div className="contact-hero-grid">
          <h1>Контакты</h1>
          <p>
            Если нужна срочная организация, просто звоните. Если удобнее
            приехать лично, ниже собрали понятный маршрут и режим работы.
          </p>
        </div>
      </section>

      <section className="contact-columns">
        <div className="contact-primary">
          <article className="contact-panel contact-panel-call">
            <span>Основная линия</span>
            <a href="tel:+79991234567">+7 (999) 123-45-67</a>
            <p>Круглосуточно, без выходных</p>
          </article>

          <article className="contact-panel contact-panel-call">
            <span>Экстренный выезд</span>
            <a href="tel:+79999999999">+7 (999) 999-99-99</a>
            <p>Агент на связи 24/7</p>
          </article>
        </div>

        <div className="contact-secondary">
          <article className="contact-detail">
            <span>Email</span>
            <a href="mailto:info@funeral.ru">info@funeral.ru</a>
          </article>

          <article className="contact-detail">
            <span>Telegram</span>
            <a
              href="https://t.me/+79991234568"
              target="_blank"
              rel="noopener noreferrer"
            >
              +7 (999) 123-45-67
            </a>
          </article>

          <article className="contact-detail">
            <span>WhatsApp</span>
            <a
              href="https://wa.me/79991234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              +7 (999) 123-45-67
            </a>
          </article>

          <article className="contact-detail">
            <span>Viber</span>
            <a
              href="viber://chat?number=79991234569"
              target="_blank"
              rel="noopener noreferrer"
            >
              +7 (999) 123-45-67
            </a>
          </article>

          <article className="contact-detail">
            <span>Адрес</span>
            <p>г. Москва, ул. Пушкина, д. Колотушкина</p>
            <p>Ежедневно с 9:00 до 21:00</p>
          </article>

          <article className="contact-detail">
            <span>Как добраться</span>
            <p>Метро «Примерная», 5 минут пешком</p>
            <p>Бесплатная парковка у входа</p>
          </article>
        </div>
      </section>
    </div>
  );
}
