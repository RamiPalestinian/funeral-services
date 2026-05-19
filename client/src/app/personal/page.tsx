"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import "./page.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/application/UserProvider";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import EditProfileForm from "@/features/profile/ui/EditProfileForm/EditProfileForm";
import ProfileAvatarEditor from "@/features/profile/ui/ProfileAvatarEditor/ProfileAvatarEditor";
import ChangePasswordForm from "@/features/profile/ui/ChangePasswordForm/ChangePasswordForm";
import DeleteProfileButton from "@/features/profile/ui/DeleteProfileButton/DeleteProfileButton";

export default function Personal() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { isInitialized } = useAppSelector((state) => state.user);

  const registrationDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ru-RU")
    : "Дата не указана";

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace(CLIENT_ROUTES.AUTH);
    }
  }, [isInitialized, user, router]);

  if (!isInitialized) {
    return (
      <main className="personal-page">
        <p className="personal-loading">Проверка входа…</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = [user.lastName, user.name, user.middleName]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="personal-page">
      <section className="personal-hero">
        <p className="personal-eyebrow">Личный кабинет</p>
        <h1>{fullName || user.name}</h1>
        <div className="personal-profile-card">
          <ProfileAvatarEditor user={user} setUser={setUser} />
          <div className="personal-profile-body">
            <p className="personal-profile-greeting">
              Добро пожаловать в ваш профиль
            </p>
            <dl className="personal-profile-meta">
              <div className="personal-profile-meta__row">
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              {user.phone && (
                <div className="personal-profile-meta__row">
                  <dt>Телефон</dt>
                  <dd>{user.phone}</dd>
                </div>
              )}
              {(user.city || user.address) && (
                <div className="personal-profile-meta__row">
                  <dt>Адрес</dt>
                  <dd>
                    {[user.city, user.address].filter(Boolean).join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <small className="personal-profile-date">
            <span>Регистрация</span>
            <time dateTime={user.createdAt ?? undefined}>{registrationDate}</time>
          </small>
        </div>
      </section>

      <section className="personal-section personal-section--nav">
        <div className="personal-section-head">
          <p className="personal-eyebrow">Навигация</p>
          <h3>Услуги и разделы</h3>
        </div>
        <div className="personal-service-grid">
          <button
            type="button"
            className="personal-btn personal-btn--nav"
            onClick={() => router.push(CLIENT_ROUTES.ISLAMIC)}
          >
            Исламские
          </button>
          <button
            type="button"
            className="personal-btn personal-btn--nav"
            onClick={() => router.push(CLIENT_ROUTES.CREMATION)}
          >
            Кремация
          </button>
          <button
            type="button"
            className="personal-btn personal-btn--nav"
            onClick={() => router.push(CLIENT_ROUTES.CLASSIC)}
          >
            Классические
          </button>
          <button
            type="button"
            className="personal-btn personal-btn--nav"
            onClick={() => router.push(CLIENT_ROUTES.SHOP)}
          >
            Магазин
          </button>
        </div>
        <div className="personal-section-divider" aria-hidden="true" />
        <div className="personal-service-grid personal-service-grid--shortcuts">
          <button
            type="button"
            className="personal-btn personal-btn--nav"
            onClick={() => router.push(CLIENT_ROUTES.CARD)}
          >
            Перейти в корзину
          </button>
          <button
            type="button"
            className="personal-btn personal-btn--nav"
            onClick={() => router.push(CLIENT_ROUTES.HOME)}
          >
            Вернуться на главную
          </button>
        </div>
      </section>

      <section className="personal-section personal-edit">
        <div className="personal-section-head">
          <p className="personal-eyebrow">Профиль</p>
          <h3>Редактировать данные</h3>
        </div>
        <div className="personal-edit-grid">
          <EditProfileForm user={user} setUser={setUser} />
          <ChangePasswordForm />
        </div>
      </section>

      <section className="personal-section personal-danger">
        <div className="personal-section-head">
          <p className="personal-eyebrow">Аккаунт</p>
          <h3>Удаление профиля</h3>
        </div>
        <DeleteProfileButton />
      </section>
    </main>
  );
}
