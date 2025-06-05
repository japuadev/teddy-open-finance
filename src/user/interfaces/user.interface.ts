import { Users, Urls } from '@prisma/client';
export interface IUser extends Users {
  email: string;
  password: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  urls?: Urls[];
}
