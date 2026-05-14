import { createAsyncThunk } from "@reduxjs/toolkit";
import {IslamicType, NewIslamicType} from '../model';
import {AxiosError} from 'axios';
import {axiosInstance} from '@/shared/lib/axiosInstance';

const ISLAMIC_THUNK_NAMES = {
    SET_ISLAMIC: 'islamic/fetchIslamic',
    SET_ONE_ISLAMIC: 'islamic/fetchIslamicById',
    ADD_ISLAMIC: 'islamic/createIslamic',
    DELETE_ISLAMIC: 'islamic/deleteIslamic',
    GET_USER_ISLAMIC: 'islamic/getUserIslamic',
} as const;

const ISLAMIC_API_URLS = {
    SET_ISLAMIC: '/islamic',
    SET_ONE_ISLAMIC: (id: number) => `/islamic/${id}`,
    ADD_ISLAMIC: '/islamic',
    DELETE_ISLAMIC: (id: number) => `/islamic/${id}`,
    GET_USER_ISLAMIC: (userId: number) => `/islamic/user/${userId}`,
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
        return responseMessage.join(', ');
    }

    if (typeof responseMessage === 'string' && responseMessage.length > 0) {
        return responseMessage;
    }

    if (typeof axiosError.response?.data?.error === 'string' && axiosError.response.data.error.length > 0) {
        return axiosError.response.data.error;
    }

    return axiosError.message ?? fallback;
}

export const fetchIslamicThunk = createAsyncThunk<IslamicType[], void, { rejectValue: string }>(
    ISLAMIC_THUNK_NAMES.SET_ISLAMIC,
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<IslamicType[]>(ISLAMIC_API_URLS.SET_ISLAMIC);
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Ошибка при загрузке исламских услуг'));
        }  
    }
);

export const fetchIslamicByIdThunk = createAsyncThunk<IslamicType, number, { rejectValue: string }>(
    ISLAMIC_THUNK_NAMES.SET_ONE_ISLAMIC,
    async (id, { rejectWithValue }) => {  
        try {
            const { data } = await axiosInstance.get<IslamicType>(ISLAMIC_API_URLS.SET_ONE_ISLAMIC(id));
            return data;
        }
        catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Ошибка при загрузке исламской услуги'));
        }
    }
);

export const createIslamicThunk = createAsyncThunk<IslamicType, NewIslamicType, { rejectValue: string }>(
    ISLAMIC_THUNK_NAMES.ADD_ISLAMIC,
    async (newIslamic, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post<IslamicType>(ISLAMIC_API_URLS.ADD_ISLAMIC, newIslamic);
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Ошибка при создании исламской услуги'));
        }
    }
);  

export const deleteIslamicThunk = createAsyncThunk<void, number, { rejectValue: string }>(
    ISLAMIC_THUNK_NAMES.DELETE_ISLAMIC,
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(ISLAMIC_API_URLS.DELETE_ISLAMIC(id));
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Ошибка при удалении исламской услуги'));
        }
    }
);  

export const getUserIslamicThunk = createAsyncThunk<IslamicType[], number, { rejectValue: string }>(
    ISLAMIC_THUNK_NAMES.GET_USER_ISLAMIC,
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<IslamicType[]>(ISLAMIC_API_URLS.GET_USER_ISLAMIC(userId));
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Ошибка при загрузке услуг пользователя'));
        }   
    }
);  