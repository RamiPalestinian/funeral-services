import { User } from './user.model';

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  lastName: string | null;
  middleName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    lastName: user.lastName ?? null,
    middleName: user.middleName ?? null,
    phone: user.phone ?? null,
    address: user.address ?? null,
    city: user.city ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
