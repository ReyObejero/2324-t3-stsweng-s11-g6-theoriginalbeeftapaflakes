import createHttpError from 'http-errors';
import { statusCodes, validationStrings } from '@/constants';
import { prismaClient } from '@/database';
import { RefreshToken } from '@/interfaces/entities';

export const refreshTokenService = {
    createRefreshToken: async (userId: number, token: string): Promise<RefreshToken> => {
        return await prismaClient.refreshToken.create({ data: { userId, token } });
    },

    deleteRefreshTokensByUserId: async (userId: number): Promise<RefreshToken[]> => {
        const affectedRefreshTokens = await refreshTokenService.getRefreshTokensByUserId(userId);
        await prismaClient.refreshToken.deleteMany({ where: { id: userId } });

        return affectedRefreshTokens;
    },

    deleteRefreshTokenByToken: async (token: string): Promise<RefreshToken> => {
        if (!(await refreshTokenService.getRefreshTokenByToken(token))) {
            throw createHttpError(statusCodes.clientError.BAD_REQUEST, validationStrings.TOKEN_DOES_NOT_EXIST);
        }

        return await prismaClient.refreshToken.delete({ where: { token } });
    },

    getRefreshTokenByToken: async (token: string): Promise<RefreshToken | null> => {
        const refreshToken = await prismaClient.refreshToken.findUnique({ where: { token } });

        return refreshToken ? refreshToken : null;
    },

    getRefreshTokensByUserId: async (userId: number): Promise<RefreshToken[]> => {
        return await prismaClient.refreshToken.findMany({ where: { userId } });
    },
};
