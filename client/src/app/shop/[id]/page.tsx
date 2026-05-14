"use client";

import "./page.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import {
  getShopByIdThunk,
  updateShopThunk,
} from "@/entities/shop/api/ShopApiThunk";
import { useUser } from "@/application/UserProvider";

export default function ShopByIdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.id === 1;

  const shop = useAppSelector((state) =>
    state.shop.shops.find((el) => el.id === Number(id)),
  );

  const updateShop = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await dispatch(
      updateShopThunk({
        id: Number(id),
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        price: Number(formData.get("price")),
        image: String(formData.get("image")),
        category: String(formData.get("category")),
      }),
    );
    setEditing(false);
  };

  useEffect(() => {
    dispatch(getShopByIdThunk(Number(id)));
  }, [dispatch, id]);

  if (!shop) {
    return null;
  }

  return (
    <div>
      <form onSubmit={updateShop}>
        <img src={shop.image} alt={shop.name} />
        <h2>{shop.name}</h2>
        <p>{shop.description}</p>
        <p>{shop.price}</p>
        <p>{shop.category}</p>
        {editing && (
          <div className="shop-edit-fields">
            <input name="name" type="text" defaultValue={shop.name} />
            <input
              name="description"
              type="text"
              defaultValue={shop.description}
            />
            <input name="price" type="number" defaultValue={shop.price} />
            <input name="image" type="text" defaultValue={shop.image} />
            <input
              name="category"
              type="text"
              defaultValue={shop.category}
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
        className="shop-back-link"
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
