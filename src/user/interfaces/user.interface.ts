export interface IUser {
  id: string;
  number: number;
  email: string;
  password: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isActive?: boolean;
  role: 'USER' | 'ADMIN';
  //   urls?: Url[];
}
