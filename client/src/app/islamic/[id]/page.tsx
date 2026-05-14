"use client";
import "../page.css";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { fetchIslamicByIdThunk } from "@/entities/islamic/api/IslamicApiThunk";
// import Image from "next/image";

export default function OneIslamicPage() {
  const dispatch = useAppDispatch();
  const { oneIslamic } = useAppSelector((state) => state.islamic);
  const { id } = useParams();

  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchIslamicByIdThunk(Number(id)));
    }
  }, [id]);

  if (!oneIslamic) return null;

  return (
    <section className="islamic-page islamic-detail-page">
      <div className="islamic-detail-media">
        <img
          className="islamic-detail-image"
          src={oneIslamic.image}
          alt={oneIslamic.name}
          width={400} // обязательный пропс
          height={300} // обязательный пропс
        />
      </div>
      <div className="islamic-detail-body">
        <p className="islamic-eyebrow">{oneIslamic.category || "Ислам"}</p>
        <h1 className="islamic-detail-title">{oneIslamic.name}</h1>
        <p className="islamic-detail-description">{oneIslamic.description}</p>
        <div className="islamic-detail-meta">
          <span>{oneIslamic.price} ₽</span>
          <span>{oneIslamic.status}</span>
        </div>
        <div className="islamic-detail-actions">
          <button
            className="islamic-card-button islamic-card-button-secondary"
            onClick={() => {
              router.back();
            }}
          >
            Назад
          </button>
          <button className="islamic-card-button">Выбрать услугу</button>
        </div>
      </div>
    </section>
  );
}
