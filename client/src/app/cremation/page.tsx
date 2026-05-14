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
  const { user } = useUser();

  useEffect(() => {
    dispatch(getAllCremationsThunk());
  }, [dispatch]);

  const handleCreateSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user === null) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    dispatch(
      createCremationThunk({
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        image: String(formData.get("image")),
        category: String(formData.get("category")),
        status: String(formData.get("status")),
        userId: user?.id,
      }),
    );
    event.currentTarget.reset();
  };

  return (
    <div>
      Кремация человека
      <form onSubmit={handleCreateSubmit}>
        <input name="name" type="text" placeholder="Название" />
        <input name="description" type="text" placeholder="Описание" />
        <input name="price" type="number" placeholder="Цена" />
        <input name="category" type="text" placeholder="Категория" />
        <input name="image" type="text" placeholder="Изображение (URL)" />
        <input name="status" type="text" placeholder="Статус" />
        <button type="submit" disabled={!user}>
          Создать похороны
        </button>
      </form>
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
