"use client";

import "../page.css";
import "@/entities/shop/ui/ShopCard/ShopCard.css";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useAddToCard,
  useAppDispatch,
  useAppSelector,
} from "@/shared/hooks/useReduxHooks";
import {
  getShopByIdThunk,
  updateShopThunk,
} from "@/entities/shop/api/ShopApiThunk";
import { useUser } from "@/application/UserProvider";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  status: "",
};

export default function ShopByIdPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const addToCard = useAddToCard();
  const isAdmin = user?.id === 1;
  const { shops, error, isLoading } = useAppSelector((state) => state.shop);
  const [formData, setFormData] = useState(initialFormState);
  const [editing, setEditing] = useState(false);

  const shop = shops.find((el) => el.id === Number(id));

  useEffect(() => {
    dispatch(getShopByIdThunk(Number(id)));
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
    if (!shop) {
      return;
    }

    setFormData({
      name: shop.name,
      description: shop.description,
      price: String(shop.price),
      image: shop.image,
      category: shop.category,
      status: shop.status,
    });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const updateShop = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await dispatch(
      updateShopThunk({
        id: Number(id),
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        category: formData.category,
        status: formData.status,
      }),
    );
    setEditing(false);
  };

  if (!shop) {
    return null;
  }

  return (
    <section className="shop-page shop-detail-page">
      <div className="shop-detail-media">
        <img
          className="shop-detail-image"
          src={shop.image}
          alt={shop.name}
          width={400}
          height={300}
        />
      </div>
      <div className="shop-detail-body">
        <p className="shop-eyebrow">{shop.category}</p>
        <h1 className="shop-detail-title">{shop.name}</h1>
        <p className="shop-detail-description">{shop.description}</p>
        <div className="shop-detail-meta">
          <span>{new Intl.NumberFormat("ru-RU").format(shop.price)} ₽</span>
          {/* <span>{shop.status}</span> */}
        </div>
        {isAdmin && editing && (
          <form className="shop-update-form" onSubmit={updateShop}>
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
            {/* <input
              name="status"
              type="text"
              value={formData.status}
              onChange={handleChange}
              placeholder="Статус"
              minLength={3}
              required
            /> */}
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
              className="shop-form-input-wide"
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
            {error && <p className="shop-update-error">{error}</p>}
            <div className="shop-update-actions">
              <button type="submit" disabled={isLoading}>
                Сохранить изменения
              </button>
              <button
                type="button"
                className="shop-update-button-secondary"
                onClick={handleCancelEdit}
              >
                Отмена
              </button>
            </div>
          </form>
        )}
        <div className="shop-detail-actions">
          <button
            type="button"
            className="shop-card-button shop-card-button-secondary"
            onClick={() => router.back()}
          >
            Назад
          </button>
          {isAdmin && (
            <button
              type="button"
              className="shop-card-button"
              onClick={handleStartEdit}
            >
              Изменить
            </button>
          )}
          <button
            type="button"
            className="shop-card-button"
            onClick={() => void addToCard({ serviceId: Number(id) })}
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  );
}
