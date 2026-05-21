import type { UserType } from "./index";

export type AdminUserCartLine = {
  cardId: number;
  name: string;
  price: number;
  category?: string | null;
};

export type AdminUserWithCart = {
  user: UserType;
  cart: AdminUserCartLine[];
};
