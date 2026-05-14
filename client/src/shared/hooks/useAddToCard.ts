"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";

export type AddToCardRef =
  | { serviceId: number }
  | { cremationId: number }
  | { islamicId: number }
  | { classicServiceId: number };

export function useAddToCard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  return useCallback(
    async (ref: AddToCardRef) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      try {
        await dispatch(
          createCardThunk({ userId: user.id, ...ref }),
        ).unwrap();
      } catch {
        // ошибка в state.card.error
      }
    },
    [dispatch, router, user],
  );
}
