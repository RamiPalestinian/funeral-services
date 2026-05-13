"use client";
import "./page.css";
import IslamicCard from "@/entities/islamic/ui/IslamicCard";
import { useRouter } from "next/navigation";

export default function Islamic() {
  const router = useRouter();
  return (
    <>
      Исламские ритуальные услуги
      <img
        src="https://islamdag.ru/sites/default/files/styles/large/public/img/2022/fatava/islamreligiya2201.jpg?itok=TmoJXWkO/image.jpg"
        alt="Исламские ритуальные услуги"
      />
      <button
        className="contact-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
      <div>
        <IslamicCard />
      </div>
    </>
  );
}
