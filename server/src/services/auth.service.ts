import { hash, verify } from 'argon2';
import createHttpError from 'http-errors';
import { env, prismaClient } from '@/config';
import { statusCodes, validationStrings } from '@/constants';
import { User } from '@/interfaces/entities';
import { generateAccessToken } from '@/utils';
import { userService } from './user.service';

export const authService = {
    login: async (username: string, password: string): Promise<string> => {
        const user = await userService.getUserByUsername(username);

        if (!user) {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.NOT_FOUND,
                validationStrings.USERNAME_NOT_REGISTERED,
            );
        }

        if (await verify(user.password, password)) {
            const accessToken = generateAccessToken(
                user.id,
                env.jwt.ACCESS_TOKEN_SECRET,
            );

            return accessToken;
        } else {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.UNAUTHORIZED,
                validationStrings.PASSWORD_INCORRECT,
            );
        }
    },

    register: async (
        username: string,
        email: string,
        password: string,
    ): Promise<User> => {
        if (await userService.getUserByUsername(username)) {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.CONFLICT,
                validationStrings.USERNAME_ALREADY_REGISTERED,
            );
        }

        if (await userService.getUserByEmail(email)) {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.CONFLICT,
                validationStrings.EMAIL_ALREADY_REGISTERED,
            );
        }

        return await prismaClient.user.create({
            data: { username, email, password: await hash(password) },
        });
    },
};
