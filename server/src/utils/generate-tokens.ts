import jwt from 'jsonwebtoken';
import { env } from '@/config';
import { type UserRole } from '@/interfaces/entities';

export const generateAccessToken = (userId: number, role: UserRole): string => {
    return jwt.sign({ userId, role }, env.jwt.ACCESS_TOKEN_SECRET, {
        expiresIn: env.jwt.ACCESS_TOKEN_EXPIRE_TIME,
    });
};

export const generateRefreshToken = (userId: number, role: UserRole): string => {
    return jwt.sign({ userId, role }, env.jwt.REFRESH_TOKEN_SECRET, {
        expiresIn: env.jwt.REFRESH_TOKEN_EXPIRE_TIME,
    });
};
