"use client";

import { useAppSelector } from "@/shared/hooks/useReduxHooks";

const ADMIN_USER_ID = 1;

export function useIsAdmin() {
  const user = useAppSelector((state) => state.user.user);
  return user?.id === ADMIN_USER_ID;
}
