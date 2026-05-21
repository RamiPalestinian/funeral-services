import { createAsyncThunk } from "@reduxjs/toolkit";
import { CardType, CreateCardPayload, MockCheckoutResult } from "../model";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { AxiosError } from "axios";

const CARD_THUNK_NAMES = {
  GET_ALL_CARDS: "card/getAllCards",
  GET_CARD_BY_ID: "card/getCardById",
  DELETE_CARD: "card/deleteCard",
  CREATE_CARD: "card/createCard",
  CHECKOUT_MOCK: "card/checkoutMOCK",
} as const;

const CARD_API_URLS = {
  GET_ALL_CARDS: "/card",
  GET_CARD_BY_ID: (id: number) => `/card/${id}`,
  DELETE_CARD: (id: number) => `/card/${id}`,
  CREATE_CARD: "/card",
  CHECKOUT_MOCK: "/card/mock-checkout",
} as const;

export const createCardThunk = createAsyncThunk<
  CardType,
  CreateCardPayload,
  { rejectValue: string }
>(CARD_THUNK_NAMES.CREATE_CARD, async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<CardType>(
      CARD_API_URLS.CREATE_CARD,
      payload,
    );

    if (response.status === 201 || response.status === 200) {
      return response.data;
    }

    return rejectWithValue("Ошибка при добавлении в корзину");
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при добавлении в корзину",
    );
  }
});

export const getAllCardsThunk = createAsyncThunk<
  CardType[],
  void,
  { rejectValue: string }
>(CARD_THUNK_NAMES.GET_ALL_CARDS, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CardType[]>(
      CARD_API_URLS.GET_ALL_CARDS,
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue("Ошибка при получении всех карт");
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при получении всех карт",
    );
  }
});

export const getCardByIdThunk = createAsyncThunk<
  CardType,
  number,
  { rejectValue: string }
>(CARD_THUNK_NAMES.GET_CARD_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CardType>(
      CARD_API_URLS.GET_CARD_BY_ID(id),
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue("Ошибка при получении карты по id");
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при получении карты по id",
    );
  }
});

export const deleteCardThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(CARD_THUNK_NAMES.DELETE_CARD, async (id, { rejectWithValue, dispatch }) => {
  try {
    const response = await axiosInstance.delete<number>(
      CARD_API_URLS.DELETE_CARD(id),
    );

    if (response.status === 200) {
      return id;
    }

    void dispatch(getAllCardsThunk());
    return rejectWithValue("Ошибка при удалении карты по id");
  } catch (error) {
    void dispatch(getAllCardsThunk());
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при удалении карты по id",
    );
  }
});

export type CheckoutPaymentMethod = "card" | "sbp" | "cash";

export const mockCheckoutThunk = createAsyncThunk<
  MockCheckoutResult,
  CheckoutPaymentMethod | void,
  { rejectValue: string }
>(CARD_THUNK_NAMES.CHECKOUT_MOCK, async (paymentMethod, { rejectWithValue }) => {
  try {
    const { data, status } = await axiosInstance.post<MockCheckoutResult>(
      CARD_API_URLS.CHECKOUT_MOCK,
      paymentMethod ? { paymentMethod } : {},
    );

    if (status === 200) {
      return data;
    }

    return rejectWithValue("Ошибка при оплате");
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при оплате",
    );
  }
});
