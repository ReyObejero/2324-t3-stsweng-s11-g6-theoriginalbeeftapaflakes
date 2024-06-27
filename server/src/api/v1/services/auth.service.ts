import { hash, verify } from 'argon2';
import createHttpError, { CreateHttpError } from 'http-errors';
import { ENV, PRISMA_CLIENT } from '@/config';
import { GENERATE_ACCESS_TOKEN } from '../utils/generate-tokens';
import { USER_SERVICE } from './user.service';

export const AUTH_SERVICE = {
    login: async (username: string, password: string) => {
        const USER = await USER_SERVICE.getUserByUsername(username);

        if (!USER) {
            throw createHttpError(
                404,
                `User with username '${username}' does not exist`,
            );
        }

        if (await verify(USER.password, password)) {
            return GENERATE_ACCESS_TOKEN(USER.id, ENV.jwt.ACCESS_TOKEN_SECRET);
        } else {
            throw createHttpError(400, 'Password is incorrect');
        }
    },

    signUp: async (username: string, email: string, password: string) => {
        if (await USER_SERVICE.getUserByUsername(username)) {
            throw createHttpError(
                400,
                `User with username '${username}' already exists`,
            );
        }

        if (await USER_SERVICE.getUserByEmail(email)) {
            throw createHttpError(
                400,
                `User with email '${email}' already exists`,
            );
        }

        const HASHED_PASSWORD = await hash(password);

        return await PRISMA_CLIENT.user.create({
            data: { username, email, password: HASHED_PASSWORD },
        });
    },
};
