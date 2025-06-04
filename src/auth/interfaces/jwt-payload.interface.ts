export interface JwtUser {
  id: string;
  email: string;
  role: string;
}

export interface JwtPayload {
  user: JwtUser;
  iat?: number;
  exp?: number;
}
