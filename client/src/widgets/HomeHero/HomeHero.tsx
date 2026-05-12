'use client';

import Link from 'next/link';
import './HomeHero.css';

export default function HomeHero() {
  return (
    <section className="home-cinematic-hero">
      <div className="home-cinematic-backdrop" aria-hidden="true" />
      <div className="home-cinematic-grain" aria-hidden="true" />

      <div className="home-cinematic-nav-space" aria-hidden="true" />

      <div className="home-cinematic-inner">
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

      <a href="#home-content" className="home-scroll-indicator" aria-label="Scroll down">
        <span />
      </a>
    </section>
  );
}
