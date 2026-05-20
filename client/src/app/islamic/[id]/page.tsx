"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "../page.css";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  fetchIslamicByIdThunk,
  updateIslamicThunk,
} from "@/entities/islamic/api/IslamicApiThunk";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { useIsAdmin } from "@/shared/hooks/useIsAdmin";
import { useAddToCart } from "@/shared/hooks/useAddToCart";
import {
  islamicUpdateSchema,
  IslamicUpdateFormInput,
  IslamicUpdateSchema,
} from "@/entities/islamic/model/islamicChema";

export default function OneIslamicPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading, oneIslamic } = useAppSelector(
    (state) => state.islamic,
  );
  const { isReady } = useRequireAuth();
  const isAdmin = useIsAdmin();
  const { addIslamicToCart } = useAddToCart();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IslamicUpdateFormInput, unknown, IslamicUpdateSchema>({
    resolver: zodResolver(islamicUpdateSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
    },
  });

  const getFormValues = useCallback((): IslamicUpdateFormInput => {
    if (!oneIslamic) {
      return {
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
      };
    }

    return {
      name: oneIslamic.name,
      description: oneIslamic.description,
      price: oneIslamic.price,
      image: oneIslamic.image,
      category: oneIslamic.category ?? "",
    };
  }, [oneIslamic]);

  useEffect(() => {
    if (id) {
      dispatch(fetchIslamicByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleStartEdit = useCallback(() => {
    if (!oneIslamic) {
      return;
    }

    reset(getFormValues());
    setIsEditing(true);
  }, [oneIslamic, reset, getFormValues]);

  const handleCancelEdit = useCallback(() => {
    reset(getFormValues());
    setIsEditing(false);
  }, [reset, getFormValues]);

  const onSubmit: SubmitHandler<IslamicUpdateSchema> = async (data) => {
    if (!oneIslamic) {
      return;
    }

    try {
      await dispatch(
        updateIslamicThunk({
          id: oneIslamic.id,
          islamicData: data,
        }),
      ).unwrap();
      setIsEditing(false);
    } catch {
      // Ошибка уже записывается в islamic slice.
    }
  };

  if (!isReady) {
    return null;
  }

  if (!oneIslamic) {
    return null;
  }

  return (
    <section className="islamic-page islamic-detail-page">
      <div className="islamic-detail-media">
        <img
          className="islamic-detail-image"
          src={oneIslamic.image}
          alt={oneIslamic.name}
          width={400}
          height={300}
        />
      </div>
      <div className="islamic-detail-body">
        <p className="islamic-eyebrow">{oneIslamic.category || "Ислам"}</p>
        <h1 className="islamic-detail-title">{oneIslamic.name}</h1>
        <p className="islamic-detail-description">{oneIslamic.description}</p>
        <div className="islamic-detail-meta">
          <span>{oneIslamic.price} ₽</span>
        </div>
        {isAdmin && isEditing && (
          <form
            className="islamic-update-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input type="text" placeholder="Название" {...register("name")} />
            {errors.name && (
              <p className="islamic-update-error">{errors.name.message}</p>
            )}
            <input
              type="text"
              placeholder="Категория"
              {...register("category")}
            />
            {errors.category && (
              <p className="islamic-update-error">{errors.category.message}</p>
            )}
            <input type="number" placeholder="Цена" {...register("price")} />
            {errors.price && (
              <p className="islamic-update-error">{errors.price.message}</p>
            )}
            <input
              className="islamic-form-input-wide"
              type="url"
              placeholder="Добавить фото"
              {...register("image")}
            />
            {errors.image && (
              <p className="islamic-update-error">{errors.image.message}</p>
            )}
            <textarea placeholder="Описание" {...register("description")} />
            {errors.description && (
              <p className="islamic-update-error">
                {errors.description.message}
              </p>
            )}
            {error && <p className="islamic-update-error">{error}</p>}
            <div className="islamic-update-actions">
              <button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading
                  ? "Сохранение..."
                  : "Сохранить изменения"}
              </button>
              <button
                type="button"
                className="islamic-update-button-secondary"
                onClick={handleCancelEdit}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
        <div className="islamic-detail-actions">
          <button
            className="islamic-card-button islamic-card-button-secondary"
            onClick={() => {
              router.back();
            }}
          >
            Назад
          </button>
          {isAdmin && (
            <button
              type="button"
              className="islamic-card-button"
              onClick={handleStartEdit}
            >
              Изменить
            </button>
          )}
          <button
            type="button"
            className="islamic-card-button"
            onClick={() => void addIslamicToCart(oneIslamic.id)}
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}
