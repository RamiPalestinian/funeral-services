"use client";
import "./page.css";
import IslamicCard from "@/entities/islamic/ui/IslamicCard/IslamicCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  createIslamicThunk,
  fetchIslamicThunk,
} from "@/entities/islamic/api/IslamicApiThunk";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  status: "",
};

export default function Islamic() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { error, islamics, isLoading } = useAppSelector((state) => state.islamic);
  const user = useAppSelector((state) => state.user.user);
  const isAdmin = user?.id === 1;
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(fetchIslamicThunk());
  }, [dispatch]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      await dispatch(
        createIslamicThunk({
          ...formData,
          price: Number(formData.price),
          userId: user.id,
        }),
      ).unwrap();
      setFormData(initialFormState);
    } catch {
      // Ошибка уже записывается в islamic slice.
    }
  };

  return (
    <section className="islamic-page">
      <div className="islamic-hero">
        <p className="islamic-eyebrow">Исламская церемония</p>
        <div className="islamic-hero-grid">
          <div className="islamic-hero-copy">
            <h1>Исламские ритуальные услуги</h1>
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
            />
          </div>
        </div>
      </div>
      {isAdmin && (
        <form className="islamic-create-form" onSubmit={handleSubmit}>
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
          {/* <input
            name="status"
            type="text"
            placeholder="Статус"
            value={formData.status}
            onChange={handleChange}
            minLength={3}
            required
          /> */}
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
          {error && <p className="islamic-create-error">{error}</p>}
          <button type="submit" disabled={isLoading || !user}>
            Создать услугу
          </button>
        </form>
      )}
      <div className="islamic-grid">
        {islamics.map((islamic) => (
          <IslamicCard key={islamic.id} islamic={islamic} />
        ))}
      </div>
      <button
        className="islamic-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
