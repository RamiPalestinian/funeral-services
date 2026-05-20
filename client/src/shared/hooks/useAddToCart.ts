"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";
import type { CreateCardPayload } from "@/entities/card/model";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import { showToast } from "@/shared/lib/toast";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";

const ADD_TO_CART_ERROR = "Не удалось добавить в корзину";

export function useAddToCart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const addToCart = useCallback(
    async (payload: CreateCardPayload) => {
      if (!user) {
        router.push(CLIENT_ROUTES.AUTH);
        return;
      }

      try {
        await dispatch(createCardThunk(payload)).unwrap();
      } catch {
        showToast(ADD_TO_CART_ERROR, "error");
      }
    },
    [dispatch, router, user],
  );

  const addClassicToCart = useCallback(
    (classicServiceId: number) => addToCart({ classicServiceId }),
    [addToCart],
  );

  const addIslamicToCart = useCallback(
    (islamicId: number) => addToCart({ islamicId }),
    [addToCart],
  );

  const addCremationToCart = useCallback(
    (cremationId: number) => addToCart({ cremationId }),
    [addToCart],
  );

  const addShopToCart = useCallback(
    (serviceId: number) => addToCart({ serviceId }),
    [addToCart],
  );

  return {
    addToCart,
    addClassicToCart,
    addIslamicToCart,
    addCremationToCart,
    addShopToCart,
  };
}
