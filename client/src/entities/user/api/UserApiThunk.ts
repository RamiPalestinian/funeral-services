import { axiosInstance, setAccessToken } from "@/shared/lib/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserLoginData, UserRegisterData, UserType, UserWithTokenType } from "../model";
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

type AuthErrorResponse = {
    message?: string | string[];
    error?: string;
    statusCode?: number;
};

const extractErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<AuthErrorResponse>;
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

export const refreshTokenThunk = createAsyncThunk<UserType, void, {rejectValue: string}>(
    USER_THUNK_NAMES.REFRESH,async (_, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<UserWithTokenType>(USER_API_URLS.REFRESH)

            if (data.user) {
                setAccessToken(data.accessToken ?? '');
                return data.user;
            }
            return rejectWithValue('Ошибка при обновлении токена');
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Ошибка при обновлении токена'));
        }
    }
);

export const registerThunk = createAsyncThunk<UserType, UserRegisterData, {rejectValue: string}>(
    USER_THUNK_NAMES.REGISTER,async (userData, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<UserWithTokenType>(USER_API_URLS.REGISTER, userData)

            if (data.user) {
                setAccessToken(data.accessToken ?? '');
                return data.user;
            }
            return rejectWithValue('Ошибка при регистрации пользователя');
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Ошибка при регистрации пользователя'));
        }
    }
);

export const loginThunk = createAsyncThunk<UserType, UserLoginData, {rejectValue: string}>(
    USER_THUNK_NAMES.LOGIN,async (userData, { rejectWithValue}) => {
        try {
            const {data} = await axiosInstance.post<UserWithTokenType>(USER_API_URLS.LOGIN, userData)

            if (data.user) {
                setAccessToken(data.accessToken ?? '');
                return data.user;
            }
            return rejectWithValue('Ошибка при входе в систему');
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Ошибка при входе в систему'));
        }
    }
);

export const logoutThunk = createAsyncThunk<null, void, {rejectValue: string}>(
    USER_THUNK_NAMES.LOGOUT,async (_, { rejectWithValue}) => {
        try {
            await axiosInstance.post(USER_API_URLS.LOGOUT)

            setAccessToken('');
            return null;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, 'Ошибка при выходе из системы'));
        }
    }
);

export const deleteUserAccountThunk = createAsyncThunk<number, number, { rejectValue: string }>(
    USER_THUNK_NAMES.DELETE_ACCOUNT,
    async (userId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(
                USER_API_URLS.DELETE_ACCOUNT(userId),
            );

            return userId;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Ошибка при удалении пользователя"));
        }
    },
);
