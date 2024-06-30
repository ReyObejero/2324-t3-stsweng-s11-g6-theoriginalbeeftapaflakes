import jwt from 'jsonwebtoken';
import { env } from '@/config';

export const generateAccessToken = (userId: number, secret: string): string => {
    return jwt.sign({ userId }, secret, {
        expiresIn: env.jwt.ACCESS_TOKEN_EXPIRE_TIME,
    });
};
