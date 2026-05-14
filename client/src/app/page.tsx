"use client";
import "./page.css";
import HomeHero from "@/widgets/HomeHero/HomeHero";

export default function GeneralPage() {
  return (
    <section className="home-landing">
      <HomeHero />
      <div className="home-video-block">
        <video
          className="home-video-player"
          src="/video/video.mp4"
          loop
          controls
          muted
          width="400"
        />
      </div>
      <div className="home-content" id="home-content">
        <div className="home-feature-grid">
          <article className="home-feature-card">
            <span className="home-feature-index">01</span>
            <h2>Транспортировка и сопровождение</h2>
            <p>
              Берём на себя перевозку по городу и между регионами. Заранее
              просчитываем маршрут, время и все точки согласования, чтобы в день
              прощания не было неожиданностей.
            </p>
          </article>

          <article className="home-feature-card">
            <span className="home-feature-index">02</span>
            <h2>Документы без хаоса</h2>
            <p>
              Проверяем пакет документов так, как это делает человек, который
              оформлял их много раз. Это позволяет не терять время и не ездить
              повторно туда, где можно было всё закрыть сразу.
            </p>
          </article>

          <article className="home-feature-card">
            <span className="home-feature-index">03</span>
            <h2>Сдержанная церемония и память</h2>
            <p>
              Помогаем собрать прощание без показной торжественности и без
              ненужной суеты. Важно, чтобы родные могли проститься спокойно и
              достойно.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
