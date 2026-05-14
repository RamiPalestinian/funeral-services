"use client";

import "./CremationCard.css";
import { CremationType } from "../../model";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteCremationThunk } from "../../api/CremationApiThunk";

type CremationCardProps = {
  cremation: CremationType;
};

export default function CremationCard({ cremation }: CremationCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteCremationThunk(Number(cremation.id)));
  };

  return (
    <div>
      <img src={cremation.image} alt={cremation.name} />
      <h2>{cremation.name}</h2>
      <p>{cremation.description}</p>
      <p>{cremation.price}</p>
      <p>{cremation.status}</p>
      <button>Заказать</button>
      <button onClick={() => router.push(`/cremation/${cremation.id}`)}>
        Подробнее
      </button>
      <button onClick={() => handleDelete()}>Удалить</button>
    </div>
  );
}
