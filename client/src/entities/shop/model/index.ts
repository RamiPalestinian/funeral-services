export type ShopType = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateShopPayload = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  userId: number;
};

export type UpdateShopPayload = {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
};

export type ShopStateType = {
  shops: ShopType[];
  isLoading: boolean;
  error: string | null;
};

export const initialShopState: ShopStateType = {
  shops: [],
  isLoading: false,
  error: null,
};
