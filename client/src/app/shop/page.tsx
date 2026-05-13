"use client";
import "./page.css";
import ShopCard from "@/entities/shop/ui/ShopCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useEffect } from "react";
import { getAllShopsThunk } from "@/entities/shop/api/ShopApiThunk";
import { ShopType } from "@/entities/shop/model";

export default function Shop() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const shops = useAppSelector((state) => state.shop.shops);
  useEffect(() => {
    dispatch(getAllShopsThunk());
  }, []);
  return (
    <>
      <div>Магазин ритуальных товаров</div>
      <div>
        {shops?.map((shop: ShopType) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
      <button
        className="contact-back-link"
        onClick={() => router.push("/home")}
      >
        Назад на главную
      </button>
    </>
  );
}
