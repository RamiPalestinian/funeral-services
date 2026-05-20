"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "@/shared/consts/clientRouts";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";

export function useRequireAuth() {
  const router = useRouter();
  const { user, isInitialized } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace(CLIENT_ROUTES.AUTH);
    }
  }, [isInitialized, router, user]);

  const isReady = isInitialized && Boolean(user);

  return { user, isInitialized, isReady };
}
