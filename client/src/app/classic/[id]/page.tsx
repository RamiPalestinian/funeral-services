"use client";

import "../page.css";
import "@/entities/classic/ui/ClassicCard/ClassicCard.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import {
  fetchClassicByIdThunk,
  updateClassicThunk,
} from "@/entities/classic/api/ClassicApiThunk";
import Image from "next/image";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  status: "",
};

export default function OneClassicPage() {
  const dispatch = useAppDispatch();
  const { error, isLoading, oneClassic } = useAppSelector(
    (state) => state.classic,
  );
  //вытаскиваем юзера и инициализацию
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const isAdmin = user?.id === 1;
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);

  const handleAddToCard = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!oneClassic) {
      return;
    }
    try {
      await dispatch(
        createCardThunk({ classicServiceId: oneClassic.id }),
      ).unwrap();
    } catch {
      console.log("Ошибка при добавлении в корзину");
    }
  };
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchClassicByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartEdit = () => {
    if (!oneClassic) {
      return;
    }

    setFormData({
      name: oneClassic.name,
      description: oneClassic.description,
      price: String(oneClassic.price),
      image: oneClassic.image,
      category: oneClassic.category ?? "",
      status: oneClassic.status ?? "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (oneClassic) {
      setFormData({
        name: oneClassic.name,
        description: oneClassic.description,
        price: String(oneClassic.price),
        image: oneClassic.image,
        category: oneClassic.category ?? "",
        status: oneClassic.status ?? "",
      });
    }

    setIsEditing(false);
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!oneClassic) {
      return;
    }

    try {
      await dispatch(
        updateClassicThunk({
          id: oneClassic.id,
          classicData: {
            ...formData,
            price: Number(formData.price),
          },
        }),
      ).unwrap();
      setIsEditing(false);
    } catch {
      // Ошибка уже записывается в classic slice.
    }
  };

  //защита сраницы
  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/auth");
    }
  }, [isInitialized, user]);

  if (isInitialized && !user) {
    return null;
  }

  if (!oneClassic) return null;

  const formattedPrice = new Intl.NumberFormat("ru-RU").format(
    oneClassic.price,
  );

  return (
    <section className="classic-page classic-detail-page">
      <div className="classic-detail-media">
        <Image
          className="classic-detail-image"
          src={oneClassic.image}
          alt={oneClassic.name}
          width={400}
          height={300}
        />
      </div>
      <div className="classic-detail-body">
        <p className="classic-eyebrow">{oneClassic.category || "Классика"}</p>
        <h1 className="classic-detail-title">{oneClassic.name}</h1>
        <p className="classic-detail-description">{oneClassic.description}</p>
        <div className="classic-detail-meta">
          <span>{formattedPrice} ₽</span>
          {/* <span>{oneClassic.status}</span> */}
        </div>
        {isAdmin && isEditing && (
          <form className="classic-update-form" onSubmit={handleSubmit}>
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
              className="classic-form-input-wide"
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
            {error && <p className="classic-update-error">{error}</p>}
            <div className="classic-update-actions">
              <button type="submit" disabled={isLoading}>
                Сохранить изменения
              </button>
              <button
                type="button"
                className="classic-update-button-secondary"
                onClick={handleCancelEdit}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
        <div className="classic-detail-actions">
          <button
            className="classic-card-button classic-card-button-secondary"
            onClick={() => {
              router.back();
            }}
          >
            Назад
          </button>
          {isAdmin && (
            <button className="classic-card-button" onClick={handleStartEdit}>
              Изменить
            </button>
          )}
          <button
            type="button"
            className="classic-card-button"
            onClick={() => void handleAddToCard()}
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}
