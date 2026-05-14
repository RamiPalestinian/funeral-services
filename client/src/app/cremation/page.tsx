"use client";

import "./page.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CremationCard from "@/entities/cremation/ui/CremationCard/CremationCard";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  createCremationThunk,
  getAllCremationsThunk,
} from "@/entities/cremation/api/CremationApiThunk";
import type { CremationType } from "@/entities/cremation/model";
import { useUser } from "@/application/UserProvider";

export default function CremationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cremations, error, isLoading } = useAppSelector(
    (state) => state.cremation,
  );
  const { user } = useUser();
  const isAdmin = user?.id === 1;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCremations = cremations.filter((cremation) =>
    cremation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getAllCremationsThunk());
  }, [dispatch]);

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user === null) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    await dispatch(
      createCremationThunk({
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        image: String(formData.get("image")),
        category: String(formData.get("category")),
        status: String(formData.get("status")),
        userId: user.id,
      }),
    );
    event.currentTarget.reset();
  };

  return (
    <section className="cremation-page">
      <div className="cremation-hero">
        <p className="cremation-eyebrow">Кремация</p>
        <div className="cremation-hero-grid">
          <div className="cremation-hero-copy">
            <h1>Услуги кремации с полным сопровождением семьи</h1>
            <p>
              Берём на себя организацию кремации, оформление документов,
              согласование времени церемонии и помощь с выбором урны, чтобы
              прощание прошло спокойно и без лишней нагрузки на близких.
            </p>
          </div>
          <div className="cremation-hero-mark">
            <img
              src="https://cdn-icons-png.flaticon.com/256/2920/2920349.png"
              alt="Кремация"
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="cremation-form-wrap">
          <form className="cremation-form" onSubmit={handleCreateSubmit}>
            <input
              className="cremation-form-input"
              name="name"
              type="text"
              placeholder="Название"
              minLength={3}
              required
            />
            <input
              className="cremation-form-input"
              name="category"
              type="text"
              placeholder="Категория"
              minLength={3}
              required
            />
            <input
              className="cremation-form-input"
              name="price"
              type="number"
              placeholder="Цена"
              min={0}
              required
            />
            <input
              className="cremation-form-input"
              name="image"
              type="url"
              placeholder="Ссылка на изображение"
              required
            />
            <textarea
              className="cremation-form-textarea"
              name="description"
              placeholder="Описание"
              minLength={10}
              required
            />
            <button className="cremation-form-button" type="submit" disabled={!user || isLoading}>
              {isLoading ? "Создание..." : "Создать услугу"}
            </button>
          </form>
          {error && <p className="cremation-form-error">{error}</p>}
        </div>
      )}

      <div className="cremation-filter-bar">
        <span className="cremation-filter-label">Фильтрация</span>
        <input
          className="cremation-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию"
          aria-label="Поиск услуг по названию"
        />
      </div>

      <div className="cremation-grid">
        {filteredCremations.map((cremation: CremationType) => (
          <CremationCard key={cremation.id} cremation={cremation} />
        ))}
      </div>
      <button
        type="button"
        className="cremation-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
