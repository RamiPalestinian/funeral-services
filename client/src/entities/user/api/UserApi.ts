import { axiosInstance } from '../../../shared/lib/axiosInstance';
import type { AxiosError } from 'axios';
import type { UserWithTokenType } from '../model';

console.log('axiosInstance:', axiosInstance);

type AuthRequestData = {
  name?: string;
  email: string;
  password: string;
};

type ApiResponse<T = undefined> = {
  statusCode?: number;
  data?: T;
  error?: string;
  message?: string;
};

type ErrorResponse = {
  statusCode?: number;
  error?: string;
  message?: string | string[];
};

const getErrorMessage = (error: AxiosError<ErrorResponse>) => {
  const responseMessage = error.response?.data?.message;

  if (Array.isArray(responseMessage) && responseMessage.length > 0) {
    return responseMessage.join(', ');
  }

  if (typeof responseMessage === 'string' && responseMessage.length > 0) {
    return responseMessage;
  }

  if (typeof error.response?.data?.error === 'string' && error.response.data.error.length > 0) {
    return error.response.data.error;
  }

  return 'Request failed';
};

export default class UserApi {
  static async register(userData: AuthRequestData) {
    try {
      const response = await axiosInstance.post<UserWithTokenType>('/auth/register', userData);
      return {
        statusCode: response.status,
        data: response.data,
      } as ApiResponse<UserWithTokenType>;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        statusCode: axiosError.response?.status,
        error: getErrorMessage(axiosError),
      } as ApiResponse<UserWithTokenType>;
    }
  }

  static async login(userData: AuthRequestData) {
    try {
      const response = await axiosInstance.post<UserWithTokenType>('/auth/login', userData);
      return {
        statusCode: response.status,
        data: response.data,
      } as ApiResponse<UserWithTokenType>;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        statusCode: axiosError.response?.status,
        error: getErrorMessage(axiosError),
      } as ApiResponse<UserWithTokenType>;
    }
  }

  static async refresh() {
    try {
      const response = await axiosInstance.post<UserWithTokenType>('/auth/refresh');
      return {
        statusCode: response.status,
        data: response.data,
      } as ApiResponse<UserWithTokenType>;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        statusCode: axiosError.response?.status,
        error: getErrorMessage(axiosError),
      } as ApiResponse<UserWithTokenType>;
    }
  }

  static async logout() {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return {
        statusCode: response.status,
      } as ApiResponse;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return {
        statusCode: axiosError.response?.status,
        error: getErrorMessage(axiosError),
      } as ApiResponse;
    }
  }

  static async deleteUser(id: number) {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return { error: getErrorMessage(axiosError) };
    }
  }
}
