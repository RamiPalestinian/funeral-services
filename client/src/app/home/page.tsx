"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import "./page.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useEffect } from "react";
import Image from "next/image";
const CemeteriesMap = dynamic(
  () =>
    import("@/shared/ui/CemeteriesMap/CemeteriesMap").then(
      (mod) => mod.CemeteriesMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="cemeteries-map cemeteries-map--loading">
        Загрузка карты…
      </div>
    ),
  },
);

export default function Home() {
  const router = useRouter();

  const { user, isInitialized } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(CLIENT_ROUTES.AUTH);
    }
  }, [isInitialized, router, user]);
  if (isInitialized && !user) {
    return null;
  }
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
              onClick={() => router.push(CLIENT_ROUTES.CONTACT)}
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
            <button onClick={() => router.push(CLIENT_ROUTES.ISLAMIC)}>Подробнее</button>
          </article>

          <article className="home-service-card">
            <span>02</span>
            <h3>Классические похороны</h3>
            <p>
              Традиционная церемония прощания: подготовка тела, организация
              зала, траурный транспорт, помощь в выборе места захоронения.
            </p>
            <button onClick={() => router.push(CLIENT_ROUTES.CLASSIC)}>Подробнее</button>
          </article>

          <article className="home-service-card">
            <span>03</span>
            <h3>Кремация</h3>
            <p>
              Организация кремации с возможностью хранения урны в колумбарии или
              захоронения урны с прахом.
            </p>
            <button onClick={() => router.push(CLIENT_ROUTES.CREMATION)}>Подробнее</button>
          </article>

          <article className="home-service-card">
            <span>04</span>
            <h3>Магазин 24/7</h3>
            <p>
              Круглосуточный магазин ритуальных товаров: гробы, венки,
              памятники, ритуальная одежда и аксессуары.
            </p>
            <button onClick={() => router.push(CLIENT_ROUTES.SHOP)}>Подробнее</button>
          </article>
        </div>
      </section>

      <section className="home-cemeteries">
        <div className="home-section-head">
          <p>Кладбища Москвы</p>
          <h2>Места захоронения, с которыми мы работаем</h2>
        </div>
        <CemeteriesMap />
      </section>

      <section className="home-values">
        <div className="home-section-head">
          <p>Почему мы</p>
          <h2>Работаем не громко, а точно</h2>
        </div>
        <div className="home-ads-stack" aria-label="Рекламные баннеры">
          <p className="home-ads-label">РЕКЛАМА:</p>
          <a
            className="home-svo-ad home-svo-ad--main"
            href="https://службапоконтракту.рф"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на сайт Министерства обороны"
          >
            <Image
              src="/svo.jpeg"
              alt="Информационный баннер"
              width={160}
              height={220}
            />
          </a>
          <a
            className="home-svo-ad"
            href="https://kontrakt-bpla.ru/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на сайт Министерства обороны"
          >
            <Image
              src="/svo2.jpg"
              alt="Информационный баннер"
              width={160}
              height={160}
            />
          </a>
          <a
            className="home-svo-ad home-credit-ad"
            href="https://home.kz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Перейти на сайт Home Credit Bank Казахстан"
          >
            <Image src="/credit.png" alt="Рассрочка" width={140} height={130} />
            <span>Рассматриваем возможность в рассрочку под 15% годовых</span>
          </a>
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
              onClick={() => router.push(CLIENT_ROUTES.CONTACT)}
            >
              Перейти в контакты
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
