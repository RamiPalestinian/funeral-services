import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { OrderType } from "../model";

export async function fetchAdminOrders(): Promise<OrderType[]> {
  const { data } = await axiosInstance.get<OrderType[]>("/orders/admin");
  return data;
}
