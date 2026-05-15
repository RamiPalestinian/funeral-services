"use client";
import "./page.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/application/UserProvider";


export default function Personal() {
  const router = useRouter();
  const {user} = useUser();
  const registrationDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('ru-RU')
    : 'Дата не указана';


  return (
    <main className="personal-page">
      <section className="personal-hero">
        <p className="personal-eyebrow">Личный кабинет</p>
        <h1>Личный кабинет</h1>
        <div className="personal-profile-card">
          <div className="personal-avatar">{user?.name?.[0] ?? "?"}</div>
          <div>
            <h2>Добро пожаловать, {user?.name}!</h2>
            <p>Ваш email: {user?.email}</p>
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
          <button onClick={() => router.push("/islamic")}>Исламские</button>
          <button onClick={() => router.push("/cremation")}>Кремация</button>
          <button onClick={() => router.push("/classic")}>Классические</button>
          <button onClick={() => router.push("/shop")}>Магазин</button>
        </div>
      </section>

      <section className="personal-section personal-shortcuts">
        <button onClick={() => router.push("/card")}>Перейти в корзину</button>
        <button onClick={() => router.push("/home")}>Вернуться на главную</button>
      </section>

      <section className="personal-section personal-edit">
        <div className="personal-section-head">
          <p className="personal-eyebrow">Профиль</p>
          <h3>Редактировать профиль</h3>
        </div>
        <div className="personal-edit-grid">
          <article>
            <span>Имя</span>
            <p>изменить Имя</p>
          </article>
          <article>
            <span>Пароль</span>
            <p>изменить Пароль</p>
          </article>
        </div>
      </section>
    </main>
  );
}
