"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "./page.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CremationCard from "@/entities/cremation/ui/CremationCard/CremationCard";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  createCremationThunk,
  getAllCremationsThunk,
} from "@/entities/cremation/api/CremationApiThunk";
import type { CremationType } from "@/entities/cremation/model";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CremationFormInput,
  cremationSchema,
  CremationSchema,
} from "@/entities/cremation/model/cremationSchema";

export default function CremationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cremations, error } = useAppSelector((state) => state.cremation);
  const { user, isInitialized } = useAppSelector((state) => state.user);

  const isAdmin = user?.id === 1;
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CremationFormInput, unknown, CremationSchema>({
    resolver: zodResolver(cremationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      userId: 1,
    },
  });

  const filteredCremations = cremations.filter((cremation) =>
    cremation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(getAllCremationsThunk());
  }, [dispatch]);

  const handleAddToCard = useCallback(
    async (cremationId: number) => {
      if (!user) {
        router.push(CLIENT_ROUTES.AUTH);
        return;
      }
      try {
        await dispatch(createCardThunk({ cremationId })).unwrap();
      } catch {
        console.log("Ошибка при добавлении в корзину");
      }
    },
    [user, router, dispatch],
  );

  const onSubmit: SubmitHandler<CremationSchema> = useCallback(
    async (data) => {
      try {
        await dispatch(createCremationThunk(data)).unwrap();
        reset();
      } catch (error) {
        console.error("Ошибка при создании услуги кремации:", error);
      }
    },
    [dispatch, reset],
  );

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(CLIENT_ROUTES.AUTH);
    }
  }, [isInitialized, user]);

  if (isInitialized && !user) {
    return null;
  }

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
          <form className="cremation-form" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("name")}
              className="cremation-form-input"
              type="text"
              placeholder="Название"
              minLength={3}
              required
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
            <input
              {...register("category")}
              className="cremation-form-input"
              type="text"
              placeholder="Категория"
              minLength={3}
              required
            />
            {errors.category && (
              <p className="error">{errors.category.message}</p>
            )}
            <input
              {...register("price")}
              className="cremation-form-input"
              type="number"
              placeholder="Цена"
              min={0}
              required
            />
            {errors.price && <p className="error">{errors.price.message}</p>}
            <input
              {...register("image")}
              className="cremation-form-input cremation-form-input-wide"
              type="url"
              placeholder="Добавить фото"
              required
            />
            {errors.image && <p className="error">{errors.image.message}</p>}
            <textarea
              {...register("description")}
              className="cremation-form-textarea"
              placeholder="Описание"
              minLength={10}
              required
            />
            {errors.description && (
              <p className="error">{errors.description.message}</p>
            )}
            <button
              className="cremation-form-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Создать услугу"}
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
          <CremationCard
            key={cremation.id}
            cremation={cremation}
            onAddToCard={() => void handleAddToCard(cremation.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="cremation-back-link"
        onClick={() => router.push(CLIENT_ROUTES.HOME)}
      >
        Назад на главную
      </button>
    </section>
  );
}
