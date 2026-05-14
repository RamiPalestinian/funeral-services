import { ClassicType } from "@/entities/classic/model";
import { CremationType } from "@/entities/cremation/model";
import { IslamicType } from "@/entities/islamic/model";
import { UserType } from "@/entities/user/model";
import { ShopType } from "@/entities/shop/model";

export type CardType = {
  id: number;
  userId?: number | null;
  serviceId?: number | null;
  islamicId?: number | null;
  classicServiceId?: number | null;
  cremationId?: number | null;
  createdAt: string;
  updatedAt: string;
  user?: UserType;
  service?: ShopType;
  islamic?: IslamicType;
  classicService?: ClassicType;
  cremation?: CremationType;
};

export type CreateCardPayload = {
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
