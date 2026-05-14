"use client";

import "./IslamicCard.css";
import { deleteIslamicThunk } from "@/entities/islamic/api/IslamicApiThunk";
import type { IslamicType } from "@/entities/islamic/model";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { useRouter } from "next/navigation";

type IslamicCardProps = {
  islamic: IslamicType | null;
};

export default function IslamicCard({ islamic }: IslamicCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!islamic) {
    return null; // или можно отобразить заглушку, если данных нет
  }
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(islamic.price);

  const handleDelete = () => {
    void dispatch(deleteIslamicThunk(islamic.id));
  };

  return (
    <article className="islamic-card">
      <div className="islamic-card-media">
        <img
          className="islamic-card-image"
          src={islamic.image}
          alt={islamic.name}
          width={400}
          height={300}
        />
      </div>
      <div className="islamic-card-body">
        <p className="islamic-card-kicker">{islamic.category || "Ислам"}</p>
        <h4 className="islamic-card-title">{islamic.name}</h4>
        <p className="islamic-card-description">{islamic.description}</p>
        <div className="islamic-card-meta">
          <span className="islamic-card-price">{formattedPrice} ₽</span>
          {/* <span className="islamic-card-status">{islamic.status}</span> */}
        </div>
        <div className="islamic-card-actions">
          <button className="islamic-card-button">Выбрать услугу</button>
          <button
            className="islamic-card-button islamic-card-button-secondary"
            onClick={() => {
              router.push(`/islamic/${islamic.id}`);
            }}
          >
            Подробнее
          </button>
          <button
            type="button"
            className="islamic-card-button islamic-card-button-danger"
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}   

