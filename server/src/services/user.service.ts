import { prismaClient } from '@/config';
import createHttpError from 'http-errors';
import { statusCodes, validationStrings } from '@/constants';
import { User } from '@/interfaces/entities';

export const userService = {
    getUsers: async (): Promise<User[]> => {
        return await prismaClient.user.findMany();
    },

    getUserByEmail: async (email: string): Promise<User> => {
        const user = await prismaClient.user.findUnique({
            where: { email },
        });

        if (user) {
            return user;
        } else {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.NOT_FOUND,
                validationStrings.EMAIL_NOT_REGISTERED,
            );
        }
    },

    getUserById: async (userId: number): Promise<User> => {
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
        });

        if (user) {
            return user;
        } else {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.NOT_FOUND,
                validationStrings.ID_INVALID,
            );
        }
    },

    getUserByUsername: async (username: string): Promise<User> => {
        const user = await prismaClient.user.findUnique({
            where: { username },
        });

        if (user) {
            return user;
        } else {
            throw createHttpError(
                statusCodes.CLIENT_ERROR.NOT_FOUND,
                validationStrings.USERNAME_NOT_REGISTERED,
            );
        }
    },
};
