"use client";

import "./CremationCard.css";
import { CremationType } from "../../model";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/hooks/useReduxHooks";
import { deleteCremationThunk } from "../../api/CremationApiThunk";
import { useUser } from "@/application/UserProvider";

type CremationCardProps = {
  cremation: CremationType;
};

export default function CremationCard({ cremation }: CremationCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const isAdmin = user?.id === 1;

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
      {isAdmin && <button onClick={() => handleDelete()}>Удалить</button>}
    </div>
  );
}
