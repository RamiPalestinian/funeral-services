export type ShopType = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ShopStateType = {
  shops: ShopType | null;
  isLoading: boolean;
  error: string | null;
};

export const initialShopState: ShopStateType = {
  shops: null,
  isLoading: false,
  error: null,
};
