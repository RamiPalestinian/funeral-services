"use client";

import "./page.css";
import { useEffect } from "react";
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
  const cremations = useAppSelector((state) => state.cremation.cremations);
  const isLoading = useAppSelector((state) => state.cremation.isLoading);
  const error = useAppSelector((state) => state.cremation.error);
  const { user } = useUser();
  const isAdmin = user?.id === 1;

  useEffect(() => {
    dispatch(getAllCremationsThunk());
  }, [dispatch]);

  const handleCreateSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (user === null) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
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
      ).unwrap();
      event.currentTarget.reset();
    } catch {
      // ошибка в state.cremation.error
    }
  };

  return (
    <div>
      Кремация человека
      {isAdmin && (
        <form onSubmit={handleCreateSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Название"
            minLength={3}
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Категория"
            minLength={3}
            required
          />
          <input
            name="status"
            type="text"
            placeholder="Статус"
            minLength={3}
            required
          />
          <input name="price" type="number" placeholder="Цена" min={0} required />
          <input
            name="image"
            type="url"
            placeholder="Ссылка на изображение"
            required
          />
          <textarea
            name="description"
            placeholder="Описание"
            minLength={10}
            required
          />
          {error && <p>{error}</p>}
          <button type="submit" disabled={isLoading || !user}>
            Создать похороны
          </button>
        </form>
      )}
      <div>
        {cremations?.map((cremation: CremationType) => (
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
    </div>
  );
}
