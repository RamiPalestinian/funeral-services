import { createAsyncThunk } from "@reduxjs/toolkit";
import { CremationType } from "../model";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { AxiosError } from "axios";

const CREMATION_THUNK_NAMES = {
  GET_ALL_CREMATIONS: "cremation/getAllCremations",
  GET_CREMATION_BY_ID: "cremation/getCremationById",
  CREATE_CREMATION: "cremation/createCremation",
  UPDATE_CREMATION: "cremation/updateCremation",
  DELETE_CREMATION: "cremation/deleteCremation",
} as const;

const CREMATION_API_URLS = {
  GET_ALL_CREMATIONS: "/cremations",
  GET_CREMATION_BY_ID: (id: number) => `/cremations/${id}`,
  CREATE_CREMATION: "/cremations",
  UPDATE_CREMATION: (id: number) => `/cremations/${id}`,
  DELETE_CREMATION: (id: number) => `/cremations/${id}`,
} as const;

export const getAllCremationsThunk = createAsyncThunk<
  CremationType[],
  void,
  { rejectValue: string }
>(CREMATION_THUNK_NAMES.GET_ALL_CREMATIONS, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CremationType[]>(
      CREMATION_API_URLS.GET_ALL_CREMATIONS,
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue("Ошибка при получении всех похорон");
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при получении всех похорон",
    );
  }
});

export const getCremationByIdThunk = createAsyncThunk<
  CremationType[],
  number,
  { rejectValue: string }
>(
  CREMATION_THUNK_NAMES.GET_CREMATION_BY_ID,
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<CremationType[]>(
        CREMATION_API_URLS.GET_CREMATION_BY_ID(id),
      );

      if (response.status === 200) {
        return response.data;
      }

      return rejectWithValue("Ошибка при получении похороны по id");
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).message ?? "Ошибка при получении похороны по id",
      );
    }
  },
);

export const createCremationThunk = createAsyncThunk<
  CremationType,
  CremationType,
  { rejectValue: string }
>(
  CREMATION_THUNK_NAMES.CREATE_CREMATION,
  async (cremation, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CremationType>(
        CREMATION_API_URLS.CREATE_CREMATION,
        cremation,
      );

      if (response.status >= 200 && response.status < 300) {
        return response.data;
      }

      return rejectWithValue("Ошибка при создании похороны");
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).message ?? "Ошибка при создании похороны",
      );
    }
  },
);

export const updateCremationThunk = createAsyncThunk<
  CremationType,
  CremationType,
  { rejectValue: string }
>(
  CREMATION_THUNK_NAMES.UPDATE_CREMATION,
  async (cremation, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<CremationType>(
        CREMATION_API_URLS.UPDATE_CREMATION(cremation.id),
        cremation,
      );

      if (response.status === 200) {
        return response.data;
      }

      return rejectWithValue("Ошибка при обновлении похороны");
    } catch (error) {
      return rejectWithValue(
        (error as AxiosError).message ?? "Ошибка при обновлении похороны",
      );
    }
  },
);

export const deleteCremationThunk = createAsyncThunk<
  CremationType,
  number,
  { rejectValue: string }
>(CREMATION_THUNK_NAMES.DELETE_CREMATION, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<CremationType>(
      CREMATION_API_URLS.DELETE_CREMATION(id),
    );

    if (response.status === 200) {
      return response.data;
    }

    return rejectWithValue("Ошибка при удалении похороны");
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при удалении похороны",
    );
  }
});
