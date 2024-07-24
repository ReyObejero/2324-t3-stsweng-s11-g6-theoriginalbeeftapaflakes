import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { RefreshToken } from '@/interfaces/entities';

export const tokenService = {
    createRefreshToken: async (userId: number, token: string): Promise<RefreshToken> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_REQUIRED);
        }

        if (!token) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_REQUIRED);
        }

        return await prismaClient.refreshToken.create({ data: { userId, token } });
    },

    deleteRefreshTokensByUserId: async (userId: number): Promise<RefreshToken[]> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_REQUIRED);
        }

        const affectedRefreshTokens = await tokenService.getRefreshTokensByUserId(userId);
        await prismaClient.refreshToken.deleteMany({ where: { id: userId } });

        return affectedRefreshTokens;
    },

    deleteRefreshTokenByToken: async (token: string): Promise<RefreshToken> => {
        if (!token) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_REQUIRED);
        }

        if (!(await tokenService.getRefreshTokenByToken(token))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_NOT_FOUND);
        }

        return await prismaClient.refreshToken.delete({ where: { token } });
    },

    getRefreshTokenByToken: async (token: string): Promise<RefreshToken | null> => {
        if (!token) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.TOKEN_REQUIRED);
        }

        return await prismaClient.refreshToken.findUnique({ where: { token } });
    },

    getRefreshTokensByUserId: async (userId: number): Promise<RefreshToken[]> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_REQUIRED);
        }

        return await prismaClient.refreshToken.findMany({ where: { userId } });
    },
};
