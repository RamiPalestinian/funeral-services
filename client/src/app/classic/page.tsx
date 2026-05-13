'use client';
import "./page.css";
import ClassicCard from "@/entities/classic/ui/ClassicCard";
import { useRouter } from "next/navigation";

export default function Classic() {
  const router = useRouter();
  return (
    <>
      Ритуальные услуги
      <img
        src="https://cdn-icons-png.flaticon.com/256/5339/5339355.png"
        alt="Ритуальные услуги"
      />
      <button
        className="contact-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
      <div>
        <ClassicCard />
      </div>
    </>
  );
}
