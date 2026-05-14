"use client";
import "./page.css";
import ClassicCard from "@/entities/classic/ui/ClassicCard/ClassicCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { fetchClassicThunk } from "@/entities/classic/api/ClassicApiThunk";
import { useEffect } from "react";
// import Image from "next/image";

export default function Classic() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const classics = useAppSelector((state) => state.classic.classics);

  useEffect(() => {
    dispatch(fetchClassicThunk());
  }, []);

  return (
    <section className="classic-page">
      <div className="classic-hero">
        <p className="classic-eyebrow">Классическая церемония</p>
        <div className="classic-hero-grid">
          <div className="classic-hero-copy">
            <h1>Классические ритуальные услуги</h1>
            <p>
              Подобрали услуги для классического прощания: от базового
              сопровождения до полной церемонии с транспортом, залом и
              документами.
            </p>
          </div>
          <div className="classic-hero-mark">
            <img
              src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
              alt="Ритуальные услуги"
            />
          </div>
        </div>
      </div>

      <div className="classic-grid">
        {classics.map((classic) => (
          <ClassicCard key={classic.id} classic={classic} />
        ))}
      </div>
      <button
        className="classic-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </section>
  );
}
