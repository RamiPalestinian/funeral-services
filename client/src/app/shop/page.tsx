'use client';
import "./page.css";
import ShopCard from "@/entities/shop/ui/ShopCard";
import { useRouter } from "next/navigation";

export default function Shop() {
  const router = useRouter();
  return (
    <>
      Магазин ритуальных товаров
      <img
        src="https://centerritual.ru/sites/default/files/page-images/internet-magazin.jpg"
        alt="Shop"
      />
      <button
        className="contact-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
      <div>
        <ShopCard />
      </div>
    </>
  );
}
