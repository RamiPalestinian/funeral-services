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
import Image from "next/image";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  classicSchema,
  ClassicFormInput,
  ClassicSchema,
} from "@/entities/classic/model/classicSchema";

export default function Classic() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { classics, error: classicError } = useAppSelector(
    (state) => state.classic,
  );
  //вытаскиваем юзера и инициализацию
  const { user, isInitialized } = useAppSelector((state) => state.user);

  const isAdmin = user?.id === 1;
  const [formError, setFormError] = useState("");

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassicFormInput, unknown, ClassicSchema>({
    resolver: zodResolver(classicSchema),
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

  const onSubmit: SubmitHandler<ClassicSchema> = async (data) => {
    try {
      setFormError("");
      await dispatch(createClassicThunk(data)).unwrap();
      reset();
    } catch (error) {
      setFormError(
        typeof error === "string"
          ? error
          : "Не удалось создать услугу. Проверь поля формы.",
      );
      console.error("Ошибка при создании классической услуги:", error);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredClassics = classics.filter((classic) =>
    classic.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(fetchClassicThunk());
  }, [dispatch]);

  //защита сраницы
  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth");
    }
  }, [isInitialized, router, user]);

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
            <Image
              src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
              alt="Ритуальные услуги"
              width={182}
              height={196}
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="classic-form-wrap">
          <form className="classic-form" onSubmit={handleSubmit(onSubmit)}>
            <input
              className="classic-form-input"
              type="text"
              {...register("name")}
              placeholder="Название"
            />
            {errors.name && <p className="error">{errors.name.message}</p>}
            <input
              className="classic-form-input"
              type="text"
              {...register("category")}
              placeholder="Категория"
            />
            {errors.category && <p className="error">{errors.category.message}</p>}
            <input
              className="classic-form-input"
              type="number"
              {...register("price")}
              placeholder="Цена"
            />
       {errors.price && <p className="error">{errors.price.message}</p>}
            <input
              className="classic-form-input classic-form-input-wide"
              type="url"
              {...register("image")}
              placeholder="Добавить фото"
            />
           {errors.image && <p className="error">{errors.image.message}</p>}
            <textarea
              className="classic-form-input classic-form-textarea"
              {...register("description")}
              placeholder="Описание"
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
            <button
              className="classic-form-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Создать"}
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
