"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "./page.css";
import IslamicCard from "@/entities/islamic/ui/IslamicCard/IslamicCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  createIslamicThunk,
  fetchIslamicThunk,
} from "@/entities/islamic/api/IslamicApiThunk";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { useIsAdmin } from "@/shared/hooks/useIsAdmin";
import { useAddToCart } from "@/shared/hooks/useAddToCart";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  islamicSchema,
  IslamicFormInput,
  IslamicSchema,
} from "@/entities/islamic/model/islamicChema";

export default function Islamic() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { islamics, error: islamicError } = useAppSelector(
    (state) => state.islamic,
  );
  const { isReady } = useRequireAuth();
  const isAdmin = useIsAdmin();
  const { addIslamicToCart } = useAddToCart();
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIslamics = islamics.filter((islamic) =>
    islamic.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IslamicFormInput, unknown, IslamicSchema>({
    resolver: zodResolver(islamicSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      userId: 1,
    },
  });

  const onSubmit: SubmitHandler<IslamicSchema> = async (data) => {
    try {
      setFormError("");
      await dispatch(createIslamicThunk(data)).unwrap();
      reset();
    } catch (error) {
      setFormError(
        typeof error === "string"
          ? error
          : "Не удалось создать услугу. Проверь поля формы.",
      );
    }
  };

  useEffect(() => {
    dispatch(fetchIslamicThunk());
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return (
    <section className="islamic-page">
      <div className="islamic-hero">
        <p className="islamic-eyebrow">Исламская церемония</p>
        <div className="islamic-hero-grid">
          <div className="islamic-hero-copy">
            <h1>Исламские ритуальные услуги</h1>
            <div></div>
            <div></div>
            <p>
              Подобрали услуги для исламского прощания: от базового
              сопровождения до полной церемонии с транспортом, залом и
              документами.
            </p>
          </div>
          <div className="islamic-hero-mark">
            <img
              src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
              alt="Ритуальные услуги"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <form
          className="islamic-create-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            placeholder="Название"
            {...register("name")}
          />
          {errors.name && (
            <p className="islamic-create-error">{errors.name.message}</p>
          )}
          <input
            type="text"
            placeholder="Категория"
            {...register("category")}
          />
          {errors.category && (
            <p className="islamic-create-error">{errors.category.message}</p>
          )}
          <input
            type="number"
            placeholder="Цена"
            {...register("price")}
          />
          {errors.price && (
            <p className="islamic-create-error">{errors.price.message}</p>
          )}
          <input
            className="islamic-form-input-wide"
            type="url"
            placeholder="Добавить фото"
            {...register("image")}
          />
          {errors.image && (
            <p className="islamic-create-error">{errors.image.message}</p>
          )}
          <textarea
            placeholder="Описание"
            {...register("description")}
          />
          {errors.description && (
            <p className="islamic-create-error">{errors.description.message}</p>
          )}
          {(formError || islamicError) && (
            <p className="islamic-create-error">{formError || islamicError}</p>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Создание..." : "Создать услугу"}
          </button>
        </form>
      )}

      <div className="islamic-filter-bar">
        <span className="islamic-filter-label">Фильтрация</span>
        <input
          type="search"
          className="islamic-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию"
          aria-label="Поиск услуг по названию"
        />
      </div>

      <div className="islamic-grid">
        {filteredIslamics.map((islamic) => (
          <IslamicCard
            key={islamic.id}
            islamic={islamic}
            onAddToCard={() => void addIslamicToCart(islamic.id)}
          />
        ))}
      </div>

      <button
        type="button"
        className="islamic-back-link"
        onClick={() => router.push(CLIENT_ROUTES.HOME)}
      >
        Назад на главную
      </button>
    </section>
  );
}
