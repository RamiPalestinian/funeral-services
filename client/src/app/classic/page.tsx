"use client";
import "./page.css";
import ClassicCard from "@/entities/classic/ui/ClassicCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { fetchClassicThunk } from "@/entities/classic/api/ClassicApiThunk";
import { useEffect } from "react";
import Image from "next/image";

export default function Classic() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const classics = useAppSelector((state) => state.classic.classics);

  useEffect(() => {
    dispatch(fetchClassicThunk());
  }, []);

  return (
    <>
      Ритуальные услуги
      <Image
        src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
        alt="Ритуальные услуги"
      />
      <button
        className="contact-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
      {classics.map((classic) => (
        <ClassicCard key={classic.id} classic={classic} />
      ))}
    </>
  );
}
