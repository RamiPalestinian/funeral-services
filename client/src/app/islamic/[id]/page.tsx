"use client";

import "../page.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  fetchIslamicByIdThunk,
  updateIslamicThunk,
} from "@/entities/islamic/api/IslamicApiThunk";
import { useCallback } from "react";
import { useUser } from "@/application/UserProvider";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
};

export default function OneIslamicPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, isLoading, oneIslamic } = useAppSelector(
    (state) => state.islamic,
  );
  const { isInitialized } = useAppSelector((state) => state.user);
  const { user } = useUser();
  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace(CLIENT_ROUTES.AUTH);
    }
  }, [isInitialized, user, router]);
  const isAdmin = user?.id === 1;
  const { id } = useParams<{ id: string }>(); 
  const [formData, setFormData] = useState(initialFormState);

  const handleAddToCard = useCallback(async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!oneIslamic) {
      return;
    }
    try {
      await dispatch(createCardThunk({ islamicId: oneIslamic.id })).unwrap();
    } catch {
      console.log("Ошибка при добавлении в корзину");
    }
  }, [user, router, dispatch, oneIslamic]); 
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchIslamicByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleStartEdit = useCallback(() => {
    if (!oneIslamic) {
      return;
    }

    setFormData({
      name: oneIslamic.name,
      description: oneIslamic.description,
      price: String(oneIslamic.price),
      image: oneIslamic.image,
      category: oneIslamic.category ?? "",
    });
    setIsEditing(true);
  }, [oneIslamic]);

  const handleCancelEdit = useCallback(() => {
    if (oneIslamic) {
      setFormData({
        name: oneIslamic.name,
        description: oneIslamic.description,
        price: String(oneIslamic.price),
        image: oneIslamic.image,
        category: oneIslamic.category ?? "",
      });
    }

    setIsEditing(false);
  }, [oneIslamic]);

  const handleSubmit = useCallback(async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oneIslamic) {
      return;
    }

    try {
      await dispatch(
        updateIslamicThunk({
          id: oneIslamic.id,
          islamicData: {
            ...formData,
            price: Number(formData.price),
          },
        }),
      ).unwrap();
      setIsEditing(false);
    } catch {
      // Ошибка уже записывается в islamic slice.
    }
  }, [dispatch, oneIslamic, formData]);

  if (!oneIslamic) return null;

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
          <form className="islamic-update-form" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Название"
              value={formData.name}
              onChange={handleChange}
              minLength={3}
              required
            />
            <input
              name="category"
              type="text"
              placeholder="Категория"
              value={formData.category}
              onChange={handleChange}
              minLength={3}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Цена"
              value={formData.price}
              onChange={handleChange}
              min={0}
              required
            />
            <input
              className="islamic-form-input-wide"
              name="image"
              type="url"
              placeholder="Добавить фото"
              value={formData.image}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Описание"
              value={formData.description}
              onChange={handleChange}
              minLength={10}
              required
            />
            {error && <p className="islamic-update-error">{error}</p>}
            <div className="islamic-update-actions">
              <button type="submit" disabled={isLoading}>
                Сохранить изменения
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
            <button className="islamic-card-button" onClick={handleStartEdit}>
              Изменить
            </button>
          )}
          <button
            type="button"
            className="islamic-card-button"
            onClick={() => void handleAddToCard()}
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}
