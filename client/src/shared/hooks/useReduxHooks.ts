"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { createCardThunk } from "@/entities/card/api/CardApiThunk";

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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
        await dispatch(createCardThunk({ userId: user.id, ...ref })).unwrap();
      } catch {
        console.log("Ошибка при добавлении в корзину");
      }
    },
    [dispatch, router, user],
  );
}
