"use client";

import "../shop/page.css";
import "./page.css";
import { useRouter } from "next/navigation";

export default function TarasAndYraPage() {
  const router = useRouter();

  return (
    <section className="shop-page mentors-page">
      <div className="shop-hero mentors-hero">
        <p className="shop-eyebrow">Благодарность</p>
        <div className="shop-hero-grid mentors-hero-grid">
          <div className="shop-hero-copy">
            <h1>Тарас и Юра</h1>
            <p>
              Эта страница — не заказ, а искреннее спасибо нашим менторам за
              путь, который вы нам дали на Эльбрус Буткемпе.
            </p>
          </div>
          <div className="shop-hero-mark mentors-hero-mark" aria-hidden>
            <span className="mentors-hero-symbol">✦</span>
          </div>
        </div>
      </div>

      <div className="mentors-grid">
        <article className="mentor-card mentor-card--yura">
          <p className="mentor-card-eyebrow">Фаза 1</p>
          <h2 className="mentor-card-name">Юра</h2>
          <p className="mentor-card-text">
            Спасибо за честную обратную связь и за решение оставить меня на
            повтор первой фазы. Сначала это было непросто, но со временем стало
            ясно: это сработало в плюс. База стала крепче, задачи — понятнее, а
            уверенность — выше. Вы не «протолкнули дальше любой ценой», а
            помогли выстроить фундамент — за это отдельная благодарность.
          </p>
        </article>

        <article className="mentor-card mentor-card--taras">
          <p className="mentor-card-eyebrow">Основной наставник</p>
          <h2 className="mentor-card-name">Тарас</h2>
          <p className="mentor-card-text">
            Большую часть пути мы прошли с вами. Вы показывали много новых фишек
            и подходов, давали точное наставление — не «учитесь сами», а
            «смотрите сюда и делайте вот это дальше». Всегда были рядом, когда
            застревали в проекте. Спасибо за терпение, направление и ощущение,
            что нас не бросают один на один с кодом.
          </p>
        </article>
      </div>

      <blockquote className="mentors-quote">
        <p>
          Вместе вы дали не только стек и задачи, но и привычку думать как
          разработчики: разбираться, не паниковать, спрашивать и доводить до
          конца.
        </p>
        <footer>— команда funeral-services</footer>
      </blockquote>

      <button
        type="button"
        className="shop-back-link mentors-back"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
