"use client";
import "../page.css";
import "@/entities/classic/ui/ClassicCard/ClassicCard.css";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { fetchClassicByIdThunk } from "@/entities/classic/api/ClassicApiThunk";
// import Image from "next/image";

export default function OneClassicPage() {
  const dispatch = useAppDispatch();
  const { oneClassic } = useAppSelector((state) => state.classic);
  const { id } = useParams();

  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchClassicByIdThunk(Number(id)));
    }
  }, [id]);

  if (!oneClassic) return null;

  return (
    <section className="classic-page classic-detail-page">
      <div className="classic-detail-media">
        <img
          className="classic-detail-image"
          src={oneClassic.image}
          alt={oneClassic.name}
          width={400} // обязательный пропс
          height={300} // обязательный пропс
        />
      </div>
      <div className="classic-detail-body">
        <p className="classic-eyebrow">{oneClassic.category || "Классика"}</p>
        <h1 className="classic-detail-title">{oneClassic.name}</h1>
        <p className="classic-detail-description">{oneClassic.description}</p>
        <div className="classic-detail-meta">
          <span>{oneClassic.price} ₽</span>
          <span>{oneClassic.status}</span>
        </div>
        <div className="classic-detail-actions">
          <button
            className="classic-card-button classic-card-button-secondary"
            onClick={() => {
              router.back();
            }}
          >
            Назад
          </button>
          <button className="classic-card-button">Выбрать услугу</button>
        </div>
      </div>
    </section>
  );
}
