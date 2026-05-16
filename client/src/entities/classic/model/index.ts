export type ClassicType = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type NewClassicType = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  userId: number;
};

export type UpdateClassicType = {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
};

export type ClassicStateType = {
  classics: ClassicType[];
  oneClassic: ClassicType | null;
  isLoading: boolean;
  error: string | null;
};

export const initialClassicState: ClassicStateType = {
  classics: [],
  oneClassic: null,
  isLoading: false,
  error: null,
};
