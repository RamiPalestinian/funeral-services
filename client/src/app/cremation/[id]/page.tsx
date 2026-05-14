"use client";

import "./page.css";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  getCremationByIdThunk,
  updateCremationThunk,
} from "@/entities/cremation/api/CremationApiThunk";

export default function CremationByIdPage() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const { id } = useParams();

  const cremation = useAppSelector((state) =>
    state.cremation.cremations.find((el) => el.id === Number(id)),
  );

  const updateCremation = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    dispatch(
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
        <p>{cremation.status}</p>
        <input name="name" type="text" defaultValue={cremation.name} />
        <input
          name="description"
          type="text"
          defaultValue={cremation.description}
        />
        <input name="price" type="number" defaultValue={cremation.price} />
        <input name="image" type="text" defaultValue={cremation.image} />
        <input name="category" type="text" defaultValue={cremation.category} />
        <input name="status" type="text" defaultValue={cremation.status} />
        <button type="submit">Сохранить</button>
      </form>

      <button
        type="button"
        className="cremation-back-link"
        onClick={() => router.back()}
      >
        Назад
      </button>
    </div>
  );
}
