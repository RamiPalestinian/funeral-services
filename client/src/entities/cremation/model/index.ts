export type CremationType = {
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

export type CremationStateType = {
  cremations: CremationType[];
  isLoading: boolean;
  error: string | null;
};

export const initialCremationState: CremationStateType = {
  cremations: [],
  isLoading: false,
  error: null,
};
