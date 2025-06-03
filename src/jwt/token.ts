import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export function generateTokenPayload(payload: Record<string, any>): string {
  const secret = process.env.SECRET || 'defaultsecret';

  const token = jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRATION ?? '8d',
  });
  return token;
}

export function verifyToken(token: string): Record<string, any> {
  const secret = process.env.SECRET || 'defaultsecret';

  try {
    return jwt.verify(token, secret) as Record<string, any>;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}
