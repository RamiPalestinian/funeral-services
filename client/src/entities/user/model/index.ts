export type UserType = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UserWithTokenType = {
  user: UserType;
  accessToken: string;
};

export type UserLoginData = {
  email: string;
  password: string;
};

export type UserRegisterData = UserLoginData & {
  name: string;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  avatar?: string;
};

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type UserStateType = {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
};

export const initialUserState: UserStateType = {
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};
