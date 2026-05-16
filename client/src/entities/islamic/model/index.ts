export type IslamicType = {
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

export type NewIslamicType = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  userId: number;
};

export type UpdateIslamicType = Partial<Omit<NewIslamicType, "userId">>;

export type IslamicStateType = {
  islamics: IslamicType[];
  oneIslamic: IslamicType | null;
  isLoading: boolean;
  error: string | null;
};

export const initialIslamicState: IslamicStateType = {
  islamics: [],
  oneIslamic: null,
  isLoading: false,
  error: null,
};
