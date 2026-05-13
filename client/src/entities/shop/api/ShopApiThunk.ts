import { createAsyncThunk } from "@reduxjs/toolkit";
import { ShopType } from "../model";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import { AxiosError } from "axios";
import { ServerResponseType } from "@/shared/types";

const SHOP_THUNK_NAMES = {
  GET_ALL_SHOPS: "shop/getAllShops",
  GET_SHOP_BY_ID: "shop/getShopById",
  CREATE_SHOP: "shop/createShop",
  UPDATE_SHOP: "shop/updateShop",
  DELETE_SHOP: "shop/deleteShop",
} as const;

const SHOP_API_URLS = {
  GET_ALL_SHOPS: "/shops",
  GET_SHOP_BY_ID: (id: number) => `/shops/${id}`,
  CREATE_SHOP: "/shops",
  UPDATE_SHOP: (id: number) => `/shops/${id}`,
  DELETE_SHOP: (id: number) => `/shops/${id}`,
} as const;

export const getAllShopsThunk = createAsyncThunk<
  ShopType,
  void,
  { rejectValue: string }
>(SHOP_THUNK_NAMES.GET_ALL_SHOPS, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<ShopType>>(
      SHOP_API_URLS.GET_ALL_SHOPS,
    );

    if (response.status === 200 && response.data?.data) {
      return response.data?.data ?? null;
    }

    return rejectWithValue(
      response.data.message ?? "Ошибка при получении всех магазинов",
    );
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при получении всех магазинов",
    );
  }
});

export const getShopByIdThunk = createAsyncThunk<
  ShopType,
  number,
  { rejectValue: string }
>(SHOP_THUNK_NAMES.GET_SHOP_BY_ID, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<ShopType>>(
      SHOP_API_URLS.GET_SHOP_BY_ID(id),
    );

    if (response.status === 200 && response.data?.data) {
      return response.data?.data ?? null;
    }

    return rejectWithValue(
      response.data.message ?? "Ошибка при получении магазина по id",
    );
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при получении магазина по id",
    );
  }
});

export const createShopThunk = createAsyncThunk<
  ShopType,
  ShopType,
  { rejectValue: string }
>(SHOP_THUNK_NAMES.CREATE_SHOP, async (shop, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<ShopType>>(
      SHOP_API_URLS.CREATE_SHOP,
      shop,
    );

    if (response.status === 200 && response.data?.data) {
      return response.data?.data ?? null;
    }

    return rejectWithValue(
      response.data.message ?? "Ошибка при создании магазина",
    );
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при создании магазина",
    );
  }
});

export const updateShopThunk = createAsyncThunk<
  ShopType,
  ShopType,
  { rejectValue: string }
>(SHOP_THUNK_NAMES.UPDATE_SHOP, async (shop, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<ShopType>>(
      SHOP_API_URLS.UPDATE_SHOP(shop.id),
      shop,
    );

    if (response.status === 200 && response.data?.data) {
      return response.data?.data ?? null;
    }

    return rejectWithValue(
      response.data.message ?? "Ошибка при обновлении магазина",
    );
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при обновлении магазина",
    );
  }
});

export const deleteShopThunk = createAsyncThunk<
  ShopType,
  number,
  { rejectValue: string }
>(SHOP_THUNK_NAMES.DELETE_SHOP, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ServerResponseType<ShopType>>(
      SHOP_API_URLS.DELETE_SHOP(id),
    );

    if (response.status === 200 && response.data?.data) {
      return response.data?.data ?? null;
    }

    return rejectWithValue(
      response.data.message ?? "Ошибка при удалении магазина",
    );
  } catch (error) {
    return rejectWithValue(
      (error as AxiosError).message ?? "Ошибка при удалении магазина",
    );
  }
});
