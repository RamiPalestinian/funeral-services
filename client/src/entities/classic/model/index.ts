import type { Dispatch } from "react";

export type ClassicType = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  status?: string;
  user_id: number;
  createdAt?: string;
  updatedAt?: string;
};

export type NewClassicType = {
  name: string;
  discription: string;
  price: number;
  image: string;
};

export type ClassicStateType = {
    classics: ClassicType[];
    oneClassic: ClassicType | null;
    isLoading: boolean;
    error: string | null;
};

export type ClassicActionType =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_CLASSIC"; payload: ClassicType[] }
  | { type: "SET_ONE_CLASSIC"; payload: ClassicType | null }
  | { type: "ADD_CLASSIC"; payload: ClassicType }
  | { type: "DELETE_CLASSIC"; payload: number }
  | { type: "DELETE_USER"; payload: number };

  export type ClassicContextType = {
  state: ClassicStateType;
  dispatch: Dispatch<ClassicActionType>;
  getClassic: () => Promise<void>;
  getUserClassic: (userId: number) => Promise<void>;
  deleteOneClassic: (id: number) => Promise<void>;
  deleteOneUser: (id: number) => Promise<void>;
  getOneClassic: (id: number) => Promise<void>;
  addClassic: (classicData: NewClassicType) => Promise<void>;
};

export const initialClassicState: ClassicStateType = {
  classics: [],
  oneClassic : null,
  isLoading: false,
  error: null,
}