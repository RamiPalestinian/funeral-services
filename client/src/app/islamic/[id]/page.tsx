"use client";

import "../page.css";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  fetchIslamicByIdThunk,
  updateIslamicThunk,
} from "@/entities/islamic/api/IslamicApiThunk";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  status: "",
};

export default function OneIslamicPage() {
  const dispatch = useAppDispatch();
  const { error, isLoading, oneIslamic } = useAppSelector(
    (state) => state.islamic,
  );
  const user = useAppSelector((state) => state.user.user);
  const isAdmin = user?.id === 1;
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchIslamicByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEdit = () => {
    if (!oneIslamic) {
      return;
    }

    setFormData({
      name: oneIslamic.name,
      description: oneIslamic.description,
      price: String(oneIslamic.price),
      image: oneIslamic.image,
      category: oneIslamic.category ?? "",
      status: oneIslamic.status ?? "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (oneIslamic) {
      setFormData({
        name: oneIslamic.name,
        description: oneIslamic.description,
        price: String(oneIslamic.price),
        image: oneIslamic.image,
        category: oneIslamic.category ?? "",
        status: oneIslamic.status ?? "",
      });
    }

    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
  };

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
          {/* <span>{oneIslamic.status}</span> */}
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
              name="status"
              type="text"
              placeholder="Статус"
              value={formData.status}
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
              name="image"
              type="url"
              placeholder="Ссылка на изображение"
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
            <button
              className="islamic-card-button"
              onClick={handleStartEdit}
            >
              Изменить
            </button>
          )}
          <button className="islamic-card-button">Выбрать услугу</button>
        </div>
      </div>
    </section>
  );
}
