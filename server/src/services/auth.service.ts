import { hash, verify } from 'argon2';
import createHttpError from 'http-errors';
import { statusCodes, validationStrings } from '@/constants';
import { prismaClient } from '@/database';
import { User } from '@/interfaces/entities';
import { generateAccessToken, generateRefreshToken } from '@/utils';
import { refreshTokenService } from './refresh-token.service';
import { userService } from './user.service';

interface LoginInput {
    username: string;
    password: string;
}

interface RegisterInput {
    username: string;
    email: string;
    password: string;
}

export const authService = {
    login: async (input: LoginInput, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
        const { username, password } = input;

        const user = await userService.getUserByUsername(username);
        if (!user) {
            throw createHttpError(statusCodes.clientError.NOT_FOUND, validationStrings.USERNAME_NOT_REGISTERED);
        }

        if (!(await verify(user.password, password))) {
            throw createHttpError(statusCodes.clientError.UNAUTHORIZED, validationStrings.PASSWORD_INVALID);
        }

        const existingRefreshToken = await refreshTokenService.getRefreshTokenByToken(refreshToken);
        if (!existingRefreshToken || existingRefreshToken.userId != user.id) {
            await refreshTokenService.deleteRefreshTokensByUserId(user.id);
        } else {
            await refreshTokenService.deleteRefreshTokenByToken(existingRefreshToken.token);
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const newRefreshToken = generateRefreshToken(user.id, user.role);
        await refreshTokenService.createRefreshToken(user.id, newRefreshToken);

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    },

    register: async (input: RegisterInput): Promise<User> => {
        const { username, email, password } = input;

        if (await userService.getUserByUsername(username)) {
            throw createHttpError(statusCodes.clientError.CONFLICT, validationStrings.USERNAME_ALREADY_REGISTERED);
        }

        if (await userService.getUserByEmail(email)) {
            throw createHttpError(statusCodes.clientError.CONFLICT, validationStrings.EMAIL_ALREADY_REGISTERED);
        }

        return await prismaClient.user.create({
            data: { username, email, password: await hash(password) },
        });
    },
};
