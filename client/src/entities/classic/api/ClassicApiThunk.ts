import { createAsyncThunk } from "@reduxjs/toolkit";
import { ClassicType, NewClassicType } from "../model";
import { AxiosError } from "axios";
import { axiosInstance} from "@/shared/lib/axiosInstance";

// названия действий, которые будут создаваться thunk-ами
const CLASSIC_THUNK_NAMES = {
  SET_CLASSIC: "classic/fetchClassic",
  SET_ONE_CLASSIC: "classic/fetchClassicById",
  ADD_CLASSIC: "classic/createClassic",
  DELETE_CLASSIC: "classic/deleteClassic",
  GET_USER_CLASSIC: "classic/getUserClassic",
} as const;

// адреса на бэкенде для API-запросов
const CLASSIC_API_URLS = {
  SET_CLASSIC: "/classic",
  SET_ONE_CLASSIC: (id: number) => `/classic/${id}`,
  ADD_CLASSIC: "/classic",
  DELETE_CLASSIC: (id: number) => `/classic/${id}`,
  GET_USER_CLASSIC: (userId: number) => `/classic/user/${userId}`,
} as const;

type ErrorResponse = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<ErrorResponse>;
  const responseMessage = axiosError.response?.data?.message;

  if (Array.isArray(responseMessage) && responseMessage.length > 0) {
    return responseMessage.join(", ");
  }

  if (typeof responseMessage === "string" && responseMessage.length > 0) {
    return responseMessage;
  }

  if (typeof axiosError.response?.data?.error === "string" && axiosError.response.data.error.length > 0) {
    return axiosError.response.data.error;
  }

  return axiosError.message ?? fallback;
};

// Загрузка всех классических услуг
export const fetchClassicThunk = createAsyncThunk<ClassicType[],void,{rejectValue: string}> (
    CLASSIC_THUNK_NAMES.SET_CLASSIC,async(_, {rejectWithValue}) => {
        try{
            const {data} = await axiosInstance.get<ClassicType[]>(CLASSIC_API_URLS.SET_CLASSIC)
            return data;
        } catch (error) {
            return rejectWithValue (getErrorMessage(error, 'Ошибка при загрузке классических услуг'));
        }
       
    }
);

// Загрузка одной услуги по ID
export const fetchClassicByIdThunk = createAsyncThunk<ClassicType, number, {rejectValue: string}>(
    CLASSIC_THUNK_NAMES.SET_ONE_CLASSIC,async (id, {rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.get<ClassicType>(CLASSIC_API_URLS.SET_ONE_CLASSIC(id))
            return data;
        } catch (error) {
            return rejectWithValue (getErrorMessage(error, 'Ошибка при загрузке классических услуг'));
        }
    }
);

// Создание услуги
export const createClassicThunk = createAsyncThunk<ClassicType, NewClassicType, {rejectValue: string}>(
    CLASSIC_THUNK_NAMES.ADD_CLASSIC, async (classicData, {rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<ClassicType>(CLASSIC_API_URLS.ADD_CLASSIC, classicData)
            return data;
        } catch (error) {
            return rejectWithValue (getErrorMessage(error, 'Ошибка при создании классических услуг'));
        }
    }
);

// Удаление одной услуги
export const deleteClassicThunk = createAsyncThunk<number, number, {rejectValue: string}>(
    CLASSIC_THUNK_NAMES.DELETE_CLASSIC, async (id, {rejectWithValue}) => {
        try {
            await axiosInstance.delete(CLASSIC_API_URLS.DELETE_CLASSIC(id))
            return id;
        } catch (error) {
            return rejectWithValue (getErrorMessage(error, 'Ошибка при удалении классических услуг'));
        }
    }
);

// Загрузка услуг пользователя
export const getUserClassicThunk = createAsyncThunk<ClassicType[], number, {rejectValue: string}>(
    CLASSIC_THUNK_NAMES.GET_USER_CLASSIC,
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<ClassicType[]>(
                CLASSIC_API_URLS.GET_USER_CLASSIC(userId)
            );
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Ошибка при загрузке классических услуг пользователя'));
        }
    }
);
