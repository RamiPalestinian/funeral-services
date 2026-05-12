import { axiosInstance } from '../../../shared/lib/axiosInstance';
import type { AxiosError } from 'axios';
import type { UserType } from '../model';

console.log('axiosInstance:', axiosInstance);

type AuthRequestData = {
  name?: string;
  email: string;
  password: string;
};

type AuthResponseData = {
  accessToken: string;
  user: UserType;
};

type ApiResponse<T = undefined> = {
  statusCode?: number;
  data?: T;
  error?: string;
  message?: string;
};

export default class UserApi {
  static async register(userData: AuthRequestData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return {
        statusCode: response.status,
        data: response.data.data as AuthResponseData,
        message: response.data.message
      } as ApiResponse<AuthResponseData>;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return axiosError.response?.data ?? { error: 'Request failed' };
    }
  }

  static async login(userData: AuthRequestData) {
    try {
      const response = await axiosInstance.post('/auth/login', userData);
      return {
        statusCode: response.status,
        data: response.data.data as AuthResponseData,
        message: response.data.message
      } as ApiResponse<AuthResponseData>;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return axiosError.response?.data ?? { error: 'Request failed' };
    }
  }

  static async refresh() {
    try {
      const response = await axiosInstance.get('/auth/refresh');
      // console.log('ответ от аксиос ==>  ', response)
      return {
        statusCode: response.status,
        data: response.data.data as AuthResponseData,
        message: response.data.message
      } as ApiResponse<AuthResponseData>;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return axiosError.response?.data ?? { error: 'Request failed' };
    }
  }

  static async logout() {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return {
        statusCode: response.status,
        data: response.data.data as AuthResponseData,
        message: response.data.message
      } as ApiResponse<AuthResponseData>;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return axiosError.response?.data ?? { error: 'Request failed' };
    }
  }

  static async deleteUser(id: number) {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
     return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return axiosError.response?.data ?? { error: 'Request failed' };
    }
  }
}
