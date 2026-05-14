import type { Dispatch } from "react";

export type IslamicType = {
    id: number;
    name: string;
    description: string;  
    price: number;
    image: string;
    category?: string;
    status?: string;  
    userId: number;
    createdAt?: string;
    updatedAt?: string;
};

export type NewIslamicType = {
    name: string;
    description: string;
    price: number;
    image: string;
};

export type IslamicStateType = {
    islamics: IslamicType[];
    oneIslamic: IslamicType | null;
    isLoading: boolean;
    error: string | null;
};

export type IslamicActionType =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string }
    | { type: "CLEAR_ERROR" }
    | { type: "SET_ISLAMIC"; payload: IslamicType[] }
    | { type: "SET_ONE_ISLAMIC"; payload: IslamicType | null }
    | { type: "ADD_ISLAMIC"; payload: IslamicType }
    | { type: "DELETE_ISLAMIC"; payload: number }
    | { type: "DELETE_USER"; payload: number };

export type IslamicContextType = {
    state: IslamicStateType;
    dispatch: Dispatch<IslamicActionType>;
    getIslamic: () => Promise<void>;
    getUserIslamic: (userId: number) => Promise<void>;
    deleteOneIslamic: (id: number) => Promise<void>;
    deleteOneUser: (id: number) => Promise<void>;
    getOneIslamic: (id: number) => Promise<void>;
    addIslamic: (islamicData: NewIslamicType) => Promise<void>;
};

export const initialIslamicState: IslamicStateType = {
    islamics: [],
    oneIslamic: null,
    isLoading: false,
    error: null,
};