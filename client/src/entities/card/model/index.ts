export type CardType = {
  id: number;
  userId?: number | null;
  serviceId?: number | null;
  islamicId?: number | null;
  classicServiceId?: number | null;
  cremationId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCardPayload = {
  userId: number;
  serviceId?: number;
  islamicId?: number;
  classicServiceId?: number;
  cremationId?: number;
};

export type CardStateType = {
  cards: CardType[];
  isLoading: boolean;
  error: string | null;
};

export const initialCardState: CardStateType = {
  cards: [],
  isLoading: false,
  error: null,
};
