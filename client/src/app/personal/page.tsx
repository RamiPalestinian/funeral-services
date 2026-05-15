"use client";
import "./page.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/application/UserProvider";


export default function Personal() {
  const router = useRouter();
  const {user} = useUser();


  return (
    <>
      <div>
        <h1>Личный кабинет</h1>
        <h2>Добро пожаловать, {user?.name}!</h2>
        <p>Ваш email: {user?.email}</p>
        <small>
          Дата регистрации:{ user?.createdAt
  ? new Date(user.createdAt).toLocaleDateString('ru-RU')
  : ''}
        </small>
      </div>

      <div>
        Перейти к услугам
        <button onClick={() => router.push("/islamic")}>Исламские</button>
        <button onClick={() => router.push("/cremation")}>Кремация</button>
        <button onClick={() => router.push("/classic")}>Классические</button>
        <button onClick={() => router.push("/shop")}>Магазин</button>
      </div>
      <button onClick={() => router.push("/card")}>Перейти в корзину</button>
      <button onClick={() => router.push("/home")}>Вернуться на главную</button>

      <h3>Редактировать профиль</h3>
      <p>изменить Имя</p>
        <p>изменить Пароль</p>

    </>
  );
}
