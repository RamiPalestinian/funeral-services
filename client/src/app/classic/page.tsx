"use client";
import "./page.css";
import ClassicCard from "@/entities/classic/ui/ClassicCard/ClassicCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  createClassicThunk,
  fetchClassicThunk,
} from "@/entities/classic/api/ClassicApiThunk";
import { useEffect, useState } from "react";
import { useCallback } from "react";

export default function Classic() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { classics, error: classicError } = useAppSelector(
    (state) => state.classic,
  );
  //вытаскиваем юзера и инициализацию
  const { user, isInitialized } = useAppSelector((state) => state.user);

  const isAdmin = user?.id === 1;
  const [newClassic, setNewClassic] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    userId: 1,
  });
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClassics = classics.filter((classic) =>
    classic.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(fetchClassicThunk());
  }, [dispatch]);

  const handleAddToCard = useCallback(
    async (classicServiceId: number) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      try {
        await dispatch(createCardThunk({ classicServiceId })).unwrap();
      } catch {
        console.log("Ошибка при добавлении в корзину");
      }
    },
    [user, router, dispatch],
  );

  const handleNewClassic = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormError("");

    setNewClassic((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function addNewClassic(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await dispatch(
        createClassicThunk({
          ...newClassic,
          price: Number(newClassic.price),
          userId: user?.id ?? 1,
        }),
      ).unwrap();
      setNewClassic({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        userId: 1,
      });
      setFormError("");
    } catch (error) {
      setFormError(
        typeof error === "string"
          ? error
          : "Не удалось создать услугу. Проверь поля формы.",
      );
    }
  }

  //защита сраницы
  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth");
    }
  }, [isInitialized, user]);

  if (isInitialized && !user) {
    return null;
  }

  return (
    <section className="classic-page">
      <div className="classic-hero">
        <p className="classic-eyebrow">Классическая церемония</p>
        <div className="classic-hero-grid">
          <div className="classic-hero-copy">
            <h1>Классические ритуальные услуги</h1>
            <div></div>
            <div></div>
            <p>
              Подобрали услуги для классического прощания: от базового
              сопровождения до полной церемонии с транспортом, залом и
              документами.
            </p>
          </div>
          <div className="classic-hero-mark">
            <img
              src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
              alt="Ритуальные услуги"
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="classic-form-wrap">
          <form className="classic-form" onSubmit={addNewClassic}>
            <input
              className="classic-form-input"
              type="text"
              onChange={handleNewClassic}
              name="name"
              value={newClassic.name}
              placeholder="Название"
              minLength={3}
              required
            />
            <input
              className="classic-form-input"
              type="text"
              onChange={handleNewClassic}
              name="category"
              value={newClassic.category}
              placeholder="Категория"
              minLength={3}
              required
            />
            <input
              className="classic-form-input"
              type="number"
              onChange={handleNewClassic}
              name="price"
              value={newClassic.price}
              placeholder="Цена"
              min={0}
              required
            />
            <input
              className="classic-form-input classic-form-input-wide"
              type="url"
              onChange={handleNewClassic}
              name="image"
              value={newClassic.image}
              placeholder="Добавить фото"
              required
            />
            <textarea
              className="classic-form-input classic-form-textarea"
              onChange={handleNewClassic}
              name="description"
              value={newClassic.description}
              placeholder="Описание"
              minLength={10}
              required
            />
            <button className="classic-form-button" type="submit">
              Создать
            </button>
          </form>
          {(formError || classicError) && (
            <p className="classic-form-error">{formError || classicError}</p>
          )}
        </div>
      )}

      <div className="classic-filter-bar">
        <span className="classic-filter-label">Фильтрация</span>
        <input
          type="search"
          className="classic-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию"
          aria-label="Поиск услуг по названию"
        />
      </div>
      <div className="classic-grid">
        {filteredClassics.map((classic) => (
          <ClassicCard
            key={classic.id}
            classic={classic}
            onAddToCard={handleAddToCard}
          />
        ))}
      </div>
      <button
        className="classic-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
