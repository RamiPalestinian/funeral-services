import type { UserType } from "@/entities/user/model";

export type OrderLineItem = {
  name: string;
  price: number;
  category?: string | null;
};

export type OrderType = {
  id: number;
  userId: number;
  total: number | string;
  paymentMethod: string;
  status: string;
  items: OrderLineItem[];
  createdAt: string;
  updatedAt: string;
  user?: Pick<
    UserType,
    "id" | "name" | "lastName" | "middleName" | "phone" | "city" | "email"
  >;
};
