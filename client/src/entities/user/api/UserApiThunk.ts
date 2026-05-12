import { axiosInstance, setAccessToken } from "@/shared/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserLoginData, UserRegisterData, UserType, UserWithTokenType } from "../model";
import { ServerResponseType } from "@/shared/types";
import { AxiosError } from "axios";

const USER_THUNK_NAMES = {
    REGISTER : "user/register",
    LOGIN : "user/login",
    LOGOUT : "user/logout",
    REFRESH : "user/refresh",
    DELETE_ACCOUNT: "user/deleteAccount",
} as const;

const USER_API_URLS = {
    REGISTER : "/auth/register",
    LOGIN : "/auth/login",
    LOGOUT : "/auth/logout",
    REFRESH : "/auth/refresh",
    DELETE_ACCOUNT: (userId: number) => `/users/${userId}`,
} as const;


export const refreshTokenThunk = createAsyncThunk<UserType, void, {rejectValue: string}>(
    USER_THUNK_NAMES.REFRESH,async (_, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.get<ServerResponseType<UserWithTokenType>>(USER_API_URLS.REFRESH)

            if (data.statusCode === 200 && data.data?.user) {
                setAccessToken(data.data?.accessToken ?? '');
                return data.data?.user ?? null;
            }
            return rejectWithValue(data.error ?? 'Ошибка при обновлении токена');
        } catch (error) {
            return rejectWithValue ((error as AxiosError).message ?? 'Ошибка при обновлении токена');
        }
    }
);

export const registerThunk = createAsyncThunk<UserType, UserRegisterData, {rejectValue: string}>(
    USER_THUNK_NAMES.REGISTER,async (userData, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<ServerResponseType<UserWithTokenType>>(USER_API_URLS.REGISTER, userData)

            if (data.statusCode === 200 && data.data?.user) {
                setAccessToken(data.data?.accessToken ?? '');
                return data.data?.user ?? null;
            }
            return rejectWithValue(data.error ?? 'Ошибка при регистрации пользователя');
        } catch (error) {
            return rejectWithValue ((error as AxiosError).message ?? 'Ошибка при регистрации пользователя');
        }
    }
);

export const loginThunk = createAsyncThunk<UserType, UserLoginData, {rejectValue: string}>(
    USER_THUNK_NAMES.LOGIN,async (userData, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<ServerResponseType<UserWithTokenType>>(USER_API_URLS.LOGIN, userData)

            if (data.statusCode === 200 && data.data?.user) {
                setAccessToken(data.data?.accessToken ?? '');
                return data.data?.user ?? null;
            }
            return rejectWithValue(data.error ?? 'Ошибка при входе в систему');
        } catch (error) {
            return rejectWithValue ((error as AxiosError).message ?? 'Ошибка при входе в систему');
        }
    }
);

export const logoutThunk = createAsyncThunk<null, void, {rejectValue: string}>(
    USER_THUNK_NAMES.LOGOUT,async (_, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<ServerResponseType<null>>(USER_API_URLS.LOGOUT)

            if (data.statusCode === 200 ) {
                setAccessToken('');
                return null;
            }
            return rejectWithValue(data.error ?? 'Ошибка при выходе из системы');
        } catch (error) {
            return rejectWithValue ((error as AxiosError).message ?? 'Ошибка при выходе из системы');
        }
    }
);

export const deleteUserAccountThunk = createAsyncThunk<number, number, { rejectValue: string }>(
    USER_THUNK_NAMES.DELETE_ACCOUNT,
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete<ServerResponseType<null>>(
                USER_API_URLS.DELETE_ACCOUNT(userId),
            );

            if (data.statusCode === 200) {
                return userId;
            }
            return rejectWithValue(data.error ?? "Ошибка при удалении пользователя");
        } catch (error) {
            return rejectWithValue((error as AxiosError).message ?? "Ошибка при удалении пользователя");
        }
    },
);
