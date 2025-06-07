export interface JwtUser {
  id: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  user: JwtUser;
  token?: string;
  iat?: number;
  exp?: number;
}
