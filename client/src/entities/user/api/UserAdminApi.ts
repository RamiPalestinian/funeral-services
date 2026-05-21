import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { AdminUserWithCart } from "../model/admin";

export async function fetchAdminUsersWithCarts(): Promise<AdminUserWithCart[]> {
  const { data } = await axiosInstance.get<AdminUserWithCart[]>(
    "/users/admin",
  );
  return data;
}
