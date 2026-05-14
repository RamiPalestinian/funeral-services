"use client";
import Link from "next/link";
import "./HomeHero.css";

export default function HomeHero() {
  return (
    <section className="home-cinematic-hero">
      <div className="home-cinematic-backdrop" aria-hidden="true" />
      <div className="home-cinematic-grain" aria-hidden="true" />

      <div className="home-cinematic-inner">
        <div className="home-cinematic-stage">
          <div className="home-cinematic-copy">
            <p className="home-cinematic-kicker home-reveal home-reveal-delay-1">
              Ритуальные услуги и транспортная поддержка
            </p>
            <h1 className="home-cinematic-title home-reveal home-reveal-delay-2">
              GRUZ 200
              <span>тихое наставление в самый трудный час</span>
            </h1>

            <p className="home-cinematic-lead home-reveal home-reveal-delay-3">
              Организация, маршрут, документы, прощание.
            </p>

            <div className="home-cinematic-actions home-reveal home-reveal-delay-4">
              <Link href="/auth" className="home-action-link">
                Оставить заявку
              </Link>
            </div>
          </div>

          <aside className="home-cinematic-aside home-reveal home-reveal-delay-3">
            <div className="home-cinematic-note">
              <span>На связи 24 / 7</span>
              <p>
                Спокойный маршрут действий без лишнего шума и повторных
                объяснений.
              </p>
            </div>
            <audio
              className="home-cinematic-audio"
              src="/music/music.mp3"
              loop
              controls
              autoPlay
              // muted
            />
          </aside>
        </div>
      </div>

      <a
        href="#home-content"
        className="home-scroll-indicator"
        aria-label="Scroll down"
      >
        <span />
      </a>
    </section>
  );
}
