"use client";

import "./page.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  getCremationByIdThunk,
  updateCremationThunk,
} from "@/entities/cremation/api/CremationApiThunk";
import { useUser } from "@/application/UserProvider";

export default function CremationByIdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.id === 1;

  const cremation = useAppSelector((state) =>
    state.cremation.cremations.find((el) => el.id === Number(id)),
  );

  const updateCremation = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await dispatch(
      updateCremationThunk({
        id: Number(id),
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        image: String(formData.get("image")),
        category: String(formData.get("category")),
        status: String(formData.get("status")),
      }),
    );
    setEditing(false);
  };

  useEffect(() => {
    dispatch(getCremationByIdThunk(Number(id)));
  }, [dispatch, id]);

  if (!cremation) {
    return null;
  }

  return (
    <div>
      <form onSubmit={updateCremation}>
        <img src={cremation.image} alt={cremation.name} />
        <h2>{cremation.name}</h2>
        <p>{cremation.description}</p>
        <p>{cremation.price}</p>
        <p>{cremation.category}</p>
        {editing && (
          <div className="cremation-edit-fields">
            <input name="name" type="text" defaultValue={cremation.name} />
            <input
              name="description"
              type="text"
              defaultValue={cremation.description}
            />
            <input name="price" type="number" defaultValue={cremation.price} />
            <input name="image" type="text" defaultValue={cremation.image} />
            <input
              name="category"
              type="text"
              defaultValue={cremation.category}
            />
            <input
              name="status"
              type="text"
              defaultValue={cremation.status ?? ""}
            />
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => setEditing(false)}>
              Отмена
            </button>
          </div>
        )}
      </form>
      <button
        type="button"
        className="cremation-back-link"
        onClick={() => router.back()}
      >
        Назад
      </button>
      {isAdmin && !editing && (
        <button
          type="button"
          onClick={() => {
            setEditing(true);
          }}
        >
          Изменить
        </button>
      )}
    </div>
  );
}
