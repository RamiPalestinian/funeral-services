'use client';
import './page.css';
import HomeHero from '@/widgets/HomeHero/HomeHero';

export default function GeneralPage() {
  return (
    <section className="home-landing">
      <HomeHero />

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

        <section className="home-process">
          <div className="home-process-head">
            <p>Как это обычно происходит</p>
            <h2>
              За двадцать лет я понял одно: людям нужен ясный порядок, а не
              поток непонятных слов
            </h2>
          </div>
          <div className="home-process-grid">
            <article>
              <span>Шаг 1</span>
              <h3>Сначала спокойно разговариваем</h3>
              <p>
                Выслушиваем ситуацию, уточняем, что нужно срочно, и сразу
                убираем лишнюю панику.
              </p>
            </article>
            <article>
              <span>Шаг 2</span>
              <h3>Потом берём организацию в руки</h3>
              <p>
                Распределяем перевозку, бумаги, службу и порядок действий так,
                чтобы семья не металась между задачами.
              </p>
            </article>
            <article>
              <span>Шаг 3</span>
              <h3>И доводим всё до конца</h3>
              <p>
                Остаёмся на связи до завершения всех этапов, потому что именно
                в конце чаще всего и возникают самые тяжёлые вопросы.
              </p>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
