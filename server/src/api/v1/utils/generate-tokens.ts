import jwt from 'jsonwebtoken';
import { ENV } from '@/config';

export const GENERATE_ACCESS_TOKEN = (userId: number, secret: string) => {
    return jwt.sign({ userId }, secret, {
        expiresIn: ENV.jwt.ACCESS_TOKEN_EXPIRE_TIME,
    });
};
