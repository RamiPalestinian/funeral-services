"use client";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

import "../page.css";
import "@/entities/cremation/ui/CremationCard/CremationCard.css";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  getCremationByIdThunk,
  updateCremationThunk,
} from "@/entities/cremation/api/CremationApiThunk";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
};

function CremationByIdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { cremations, error, isLoading } = useAppSelector(
    (state) => state.cremation,
  );
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const cremation = cremations.find((el) => el.id === Number(id));

  const isAdmin = user?.id === 1;

  useEffect(() => {
    dispatch(getCremationByIdThunk(Number(id)));
  }, [dispatch, id]);

  const handleAddToCard = useCallback(async () => {
    if (!user) {
      router.push(CLIENT_ROUTES.AUTH);
      return;
    }
    try {
      await dispatch(createCardThunk({ cremationId: Number(id) })).unwrap();
    } catch {
      console.log("Ошибка при добавлении в корзину");
    }
  }, [user, router, dispatch, id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEdit = useCallback(() => {
    if (!cremation) {
      return;
    }

    setFormData({
      name: cremation.name,
      description: cremation.description,
      price: String(cremation.price),
      image: cremation.image,
      category: cremation.category,
    });
    setEditing(true);
  }, [cremation]);

  const updateCremation = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      await dispatch(
        updateCremationThunk({
          id: Number(id),
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          image: formData.image,
          category: formData.category,
        }),
      );
      setEditing(false);
    },
    [dispatch, id, formData],
  );

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(CLIENT_ROUTES.AUTH);
    }
  }, [isInitialized, user, router]);

  if (isInitialized && !user) {
    return null;
  }

  if (!cremation) {
    return null;
  }

  return (
    <section className="cremation-page cremation-detail-page">
      <div className="cremation-detail-media">
        <img
          className="cremation-detail-image"
          src={cremation.image}
          alt={cremation.name}
          width={400}
          height={300}
        />
      </div>
      <div className="cremation-detail-body">
        <p className="cremation-eyebrow">{cremation.category}</p>
        <h1 className="cremation-detail-title">{cremation.name}</h1>
        <p className="cremation-detail-description">{cremation.description}</p>
        <div className="cremation-detail-meta">
          <span>{cremation.price} ₽</span>
        </div>
        {isAdmin && editing && (
          <form className="cremation-update-form" onSubmit={updateCremation}>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Название"
              minLength={3}
              required
            />
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Категория"
              minLength={3}
              required
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Цена"
              min={0}
              required
            />
            <input
              className="cremation-form-input-wide"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="Добавить фото"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание"
              minLength={10}
              required
            />
            {error && <p className="cremation-update-error">{error}</p>}
            <div className="cremation-update-actions">
              <button type="submit" disabled={isLoading}>
                Сохранить изменения
              </button>
              <button
                type="button"
                className="cremation-update-button-secondary"
                onClick={() => setEditing(false)}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
        <div className="cremation-detail-actions">
          <button
            type="button"
            className="cremation-card-button cremation-card-button-secondary"
            onClick={() => router.back()}
          >
            Назад
          </button>
          {isAdmin && (
            <button
              type="button"
              className="cremation-card-button"
              onClick={handleStartEdit}
            >
              Изменить
            </button>
          )}
          <button
            type="button"
            className="cremation-card-button"
            onClick={() => void handleAddToCard()}
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}

export default React.memo(CremationByIdPage);
