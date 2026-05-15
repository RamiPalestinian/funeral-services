"use client";
import "./page.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/application/UserProvider";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import EditNameForm from "@/features/profile/ui/EditNameForm/EditNameForm";
import EditEmailForm from "@/features/profile/ui/EditEmailForm/EditEmailForm";
import ProfileAvatarEditor from "@/features/profile/ui/ProfileAvatarEditor/ProfileAvatarEditor";
import ChangePasswordForm from "@/features/profile/ui/ChangePasswordForm/ChangePasswordForm";

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
      router.replace("/auth");
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

  return (
    <main className="personal-page">
      <section className="personal-hero">
        <p className="personal-eyebrow">Личный кабинет</p>
        <h1>Личный кабинет</h1>
        <div className="personal-profile-card">
          <ProfileAvatarEditor user={user} setUser={setUser} />
          <div>
            <h2>Добро пожаловать, {user.name}!</h2>
            <p>Ваш email: {user.email}</p>
          </div>
          <small>Дата регистрации: {registrationDate}</small>
        </div>
      </section>

      <section className="personal-section">
        <div className="personal-section-head">
          <p className="personal-eyebrow">Навигация</p>
          <h3>Перейти к услугам</h3>
        </div>
        <div className="personal-service-grid">
          <button type="button" onClick={() => router.push("/islamic")}>
            Исламские
          </button>
          <button type="button" onClick={() => router.push("/cremation")}>
            Кремация
          </button>
          <button type="button" onClick={() => router.push("/classic")}>
            Классические
          </button>
          <button type="button" onClick={() => router.push("/shop")}>
            Магазин
          </button>
        </div>
      </section>

      <section className="personal-section personal-shortcuts">
        <button type="button" onClick={() => router.push("/card")}>
          Перейти в корзину
        </button>
        <button type="button" onClick={() => router.push("/home")}>
          Вернуться на главную
        </button>
      </section>

      <section className="personal-section personal-edit">
        <div className="personal-section-head">
          <p className="personal-eyebrow">Профиль</p>
          <h3>Редактировать профиль</h3>
        </div>
        <div className="personal-edit-grid">
          <EditNameForm user={user} setUser={setUser} />
          <EditEmailForm user={user} setUser={setUser} />
          <ChangePasswordForm />
        </div>
      </section>
    </main>
  );
}
