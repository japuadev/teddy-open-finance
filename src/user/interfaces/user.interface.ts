import { Users, Urls, Role } from '@prisma/client';
export interface IUser extends Users {
  email: string;
  password: string;
  name: string;
  role: Role;
  urls?: Urls[];
}
