"use client";
import "./page.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="home-page">
      <section className="home-intro">
        <p className="home-eyebrow">Линия поддержки и организации</p>
        <div className="home-intro-grid">
          <h1>Прощаем с заботой, тишиной и уважением</h1>
          <div className="home-intro-side">
            <p>
              Мы рядом в самый трудный момент. Организация похорон любой
              сложности с полным сопровождением, ясным маршрутом действий и
              вниманием к семье.
            </p>
            <button
              className="home-link-button"
              onClick={() => router.push("/contact")}
            >
              Связаться сейчас
            </button>
          </div>
        </div>
      </section>

      <section className="home-services">

        <div className="home-services-grid">
          <article className="home-service-card">
            <span>01</span>
            <h3>Исламские похороны</h3>
            <p>
              Организация погребения в соответствии с шариатом: омовение
              (гусль), заворачивание в саван (кафан), джаназа-намаз,
              сопровождение до кладбища.
            </p>
            <button onClick={() => router.push('/islamic')}>
              Подробнее
            </button>
          </article>

          <article className="home-service-card">
            <span>02</span>
            <h3>Классические похороны</h3>
            <p>
              Традиционная церемония прощания: подготовка тела, организация
              зала, траурный транспорт, помощь в выборе места захоронения.
            </p>
            <button onClick={() => router.push('/classic')}>
              Подробнее
            </button>
          </article>

          <article className="home-service-card">
            <span>03</span>
            <h3>Кремация</h3>
            <p>
              Организация кремации с возможностью хранения урны в колумбарии
              или захоронения урны с прахом.
            </p>
            <button onClick={() => router.push('/cremation')}>
              Подробнее
            </button>
          </article>

          <article className="home-service-card">
            <span>04</span>
            <h3>Выездная служба 24/7</h3>
            <p>
              Круглосуточная помощь: выезд агента на дом, организация
              перевозки тела, оформление всех необходимых документов.
            </p>
            <button onClick={() => router.push('/outreach')}>
              Подробнее
            </button>
          </article>
        </div>
      </section>

      <section className="home-values">
        <div className="home-section-head">
          <p>Почему мы</p>
          <h2>Работаем не громко, а точно</h2>
        </div>

        <div className="home-values-row">
          <article>
            <span>Деликатность</span>
            <p>Работаем с пониманием и уважением к вашему горю.</p>
          </article>
          <article>
            <span>Полный цикл</span>
            <p>От оформления документов до организации поминок.</p>
          </article>
          <article>
            <span>24/7</span>
            <p>Готовы выехать в любой час дня и ночи.</p>
          </article>
          <article>
            <span>Прозрачные цены</span>
            <p>Фиксированная стоимость без скрытых платежей.</p>
          </article>
        </div>
      </section>

      <section className="home-urgent">
        <p className="home-eyebrow">Экстренная связь</p>
        <div className="home-urgent-grid">
          <h2>Нужна помощь прямо сейчас?</h2>
          <div className="home-urgent-side">
            <p>Позвоните нам, и мы спокойно возьмём организацию на себя.</p>
            <a href="tel:+79991234567">+7 (999) 123-45-67</a>
            <button
              className="home-link-button"
              onClick={() => router.push('/contact')}
            >
              Перейти в контакты
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
