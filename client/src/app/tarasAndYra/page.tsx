"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "./page.css";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import Image from "next/image";

export default function TarasAndYraPage() {
  const router = useRouter();
  const { isReady } = useRequireAuth();

  if (!isReady) {
    return null;
  }

  return (
    <section className="mentors-page">
      <div className="mentors-orb mentors-orb--blue" aria-hidden="true" />
      <div className="mentors-orb mentors-orb--pink" aria-hidden="true" />

      <div className="mentors-hero">
        <div className="mentors-hero-copy">
          <p className="mentors-eyebrow">12 недель большого пути в Эльбрус буткемп</p>
          <h1>Спасибо, Тарас и Юра</h1>
          <p>
            За три месяца обучения вы помогли нам пройти путь от первых
            уверенных шагов в коде до полноценного проекта, где сошлись
            фронтенд, бэкенд, база данных, авторизация, Redux и командная
            работа.
          </p>
        </div>

        <div className="mentors-hero-badge" aria-hidden="true">
          <span>12</span>
          <strong>недель</strong>
          <small>огромного стека</small>
        </div>
      </div>

      <div className="mentors-grid">
        <article className="mentor-card mentor-card--taras">
          {/* <div className="mentor-card-number">01</div> */}
          <div className="mentor-card-photo-wrap">
            <Image
              className="mentor-card-photo"
              src="/taras.png"
              alt="Тарас"
              width={260}
              height={260}
            />
          </div>
          <div className="mentor-card-content">
            <p className="mentor-card-eyebrow">Наш преподаватель</p>
            <h2 className="mentor-card-name">Тарас</h2>
            <p className="mentor-card-text">
              Тарас был рядом каждый день как преподаватель, который не просто
              показывает синтаксис, а учит думать как разработчик. Благодаря его
              объяснениям, практике и терпению мы получили огромный объём знаний:
              научились разбирать задачи, писать код осознанно, искать ошибки и
              доводить идею до рабочего результата.
            </p>
          </div>
        </article>

        <article className="mentor-card mentor-card--yura">
          {/* <div className="mentor-card-number">02</div> */}
          <div className="mentor-card-photo-wrap">
            <Image
              className="mentor-card-photo"
              src="/yura.jpg"
              alt="Юра"
              width={280}
              height={280}
            />
          </div>
          <div className="mentor-card-content">
            <p className="mentor-card-eyebrow">Старший преподаватель</p>
            <h2 className="mentor-card-name">Юра</h2>
            <p className="mentor-card-text">
              Юра составил для нас маршрут обучения и держал общий вектор всего
              процесса. Как старший преподаватель он выстроил план так, чтобы за
              12 недель мы постепенно собрали большой стек технологий, поняли,
              как части приложения соединяются между собой, и смогли применить
              это в финальном проекте.
            </p>
          </div>
        </article>
      </div>

      <div className="mentors-stack">
        <div>
          <span>Frontend</span>
          <strong>React / Next.js / Redux</strong>
        </div>
        <div>
          <span>Backend</span>
          <strong>Node.js / Express / NestJS / Sequelize / PostgreSQL</strong>
        </div>
        <div>
          <span>Process</span>
          <strong>Git / Jest / Docker / RAG / AI интеграции / команда / финальный проект / Zod / Git hooks</strong>
        </div>
      </div>

      <section className="mentors-skills">
        <div className="mentors-skills-copy">
          <p className="mentors-skills-eyebrow">Что забрали с собой</p>
          <h2>Языки, стили и хуки</h2>
          <p>
            За время обучения мы прокачали базу веб-разработки и научились
            связывать интерфейс с логикой приложения через React-хуки.
          </p>
        </div>

        <div className="mentors-skills-panel">
          <div className="mentors-tags">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>TypeScript</span>
            <span>SQL</span>
          </div>

          <div className="mentors-hooks">
            <span>useState</span>
            <span>useRef</span>
            <span>useEffect</span>
            <span>useLayoutEffect</span>
            <span>useMemo</span>
            <span>useCallback</span>
            <span>useContext</span>
            <span>useReducer</span>
            <span>useRouter</span>
            <span>useNavigate</span>
            <span>useParams</span>
            <span>useSelector</span>
            <span>useDispatch</span>
            <span>useID</span>
            <span>useLocation</span>
            <span>usePathname</span>
            <span>useSearchParams</span>
            <span>useForm</span>
          </div>
        </div>
      </section>

      <section className="mentors-message">
        <p>
          Благодаря вам эти 12 недель стали не просто интенсивом, а настоящим
          рывком. Мы получили огромный стек, уверенность в своих силах и
          понимание, что разработка — это не магия, а путь из практики,
          дисциплины и людей, которые умеют вести вперёд.
        </p>
      </section>

      <button
        type="button"
        className="mentors-back"
        onClick={() => router.push(CLIENT_ROUTES.HOME)}
      >
        Назад на главную
      </button>
    </section>
  );
}
