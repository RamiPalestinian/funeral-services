'use client';
import "./page.css";
import CremationCard from "@/entities/cremation/ui/CremationCard";
import { useRouter } from "next/navigation";

export default function Cremation() {
  const router = useRouter();
  return (
    <>
      Кремация человека
      <img
        src="https://openagent.ru/redesign/imgs/articles/kremaciya-cheloveka-2.jpg"
        alt="Cremation"
      />
      <button
        className="contact-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
      <div>
        <CremationCard />
      </div>
    </>
  );
}
