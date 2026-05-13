"use client";
import "./page.css";
import CremationCard from "@/entities/cremation/ui/CremationCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useEffect } from "react";
import { getAllCremationsThunk } from "@/entities/cremation/api/CremationApiThunk";
import { CremationType } from "@/entities/cremation/model";

export default function Cremation() {
  const dispatch = useAppDispatch();
  const cremations = useAppSelector((state) => state.cremation.cremations);
  useEffect(() => {
    dispatch(getAllCremationsThunk());
  }, []);
  const router = useRouter();
  return (
    <div>
      Кремация человека
      <div>
        {cremations?.map((cremation: CremationType) => (
          <CremationCard key={cremation.id} cremation={cremation} />
        ))}
      </div>
      <button
        className="cremation-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </div>
  );
}
