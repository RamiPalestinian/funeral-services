"use client";
import "./page.css";
import IslamicCard from "@/entities/islamic/ui/IslamicCard/IslamicCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { fetchIslamicThunk } from "@/entities/islamic/api/IslamicApiThunk";
import { useEffect } from "react";
// import Image from "next/image";

export default function Islamic() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const islamics = useAppSelector((state) => state.islamic.islamics);

  useEffect(() => {
    dispatch(fetchIslamicThunk());
  }, []);

  return (
    <section className="islamic-page">
      <div className="islamic-hero">
        <p className="islamic-eyebrow">Исламская церемония</p>
        <div className="islamic-hero-grid">
          <div className="islamic-hero-copy">
            <h1>Исламские ритуальные услуги</h1>
            <p>
              Подобрали услуги для исламского прощания: от базового
              сопровождения до полной церемонии с транспортом, залом и
              документами.
            </p>
          </div>
          <div className="islamic-hero-mark">
            <img
              src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
              alt="Ритуальные услуги"
            />
          </div>
        </div>
      </div>
      <div className="islamic-grid">
        {islamics.map((islamic) => (
          <IslamicCard key={islamic.id} islamic={islamic} />
        ))}
      </div>
      <button
        className="islamic-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
