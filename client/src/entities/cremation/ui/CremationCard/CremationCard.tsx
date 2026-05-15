"use client";

import "./CremationCard.css";
import type { CremationType } from "../../model";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteCremationThunk } from "../../api/CremationApiThunk";
import { useUser } from "@/application/UserProvider";

type CremationCardProps = {
  cremation: CremationType;
  onAddToCard: () => void;
};

export default function CremationCard({ cremation, onAddToCard }: CremationCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const isAdmin = user?.id === 1;
  const formattedPrice = new Intl.NumberFormat("ru-RU").format(
    cremation.price,
  );

  const handleDelete = () => {
    dispatch(deleteCremationThunk(Number(cremation.id)));
  };

  return (
    <article className="cremation-card">
      <div className="cremation-card-media">
        <img
          className="cremation-card-image"
          src={cremation.image}
          alt={cremation.name}
          width={400}
          height={300}
        />
      </div>
      <div className="cremation-card-body">
        <p className="cremation-card-kicker">{cremation.category}</p>
        <h2 className="cremation-card-title">{cremation.name}</h2>
        <p className="cremation-card-description">{cremation.description}</p>
        <div className="cremation-card-meta">
          <span className="cremation-card-price">{formattedPrice} ₽</span>
          {/* {cremation.status && (
            <span className="cremation-card-status">{cremation.status}</span>
          )} */}
        </div>
        <div className="cremation-card-actions">
          <button
            type="button"
            className="cremation-card-button"
            onClick={onAddToCard}
          >
            В корзину
          </button>
          <button
            type="button"
            className="cremation-card-button cremation-card-button-secondary"
            onClick={() => router.push(`/cremation/${cremation.id}`)}
          >
            Подробнее
          </button>
          {isAdmin && (
            <button
              type="button"
              className="cremation-card-button cremation-card-button-delete"
              onClick={handleDelete}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
