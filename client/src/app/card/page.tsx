"use client";

import "./page.css";
import CardCard from "@/entities/card/ui/CardCard/CardCard";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllCardsThunk } from "@/entities/card/api/CardApiThunk";
import { useEffect } from "react";

export default function CardPage() {
  const dispatch = useAppDispatch();
  const { cards, isLoading, error } = useAppSelector((state) => state.card);
  const router = useRouter();

  useEffect(() => {
    void dispatch(getAllCardsThunk());
  }, [dispatch]);

  return (
    <div className="card-page flex flex-col gap-4">
      <header className="card-page-header">
        <h1 className="text-2xl font-semibold">Корзина</h1>
        {error ? (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </header>
      {isLoading ? <p>Загрузка…</p> : null}
      {!isLoading && cards.length === 0 && !error ? (
        <p>Корзина пуста.</p>
      ) : null}
      {cards.map((card) => (
        <CardCard key={card.id} card={card} />
      ))}
      <button type="button" onClick={() => router.push("/home")}>
        Назад на главную
      </button>
    </div>
  );
}
