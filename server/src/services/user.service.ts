import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { User } from '@/interfaces/entities';

export const userService = {
    getUserByEmail: async (email: string): Promise<User | null> => {
        if (!email) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.EMAIL_REQUIRED);
        }

        return await prismaClient.user.findUnique({
            where: { email },
        });
    },

    getUserById: async (userId: number): Promise<User | null> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_REQUIRED);
        }

        return await prismaClient.user.findUnique({
            where: { id: userId },
        });
    },

    getUserByUsername: async (username: string): Promise<User | null> => {
        if (!username) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USERNAME_REQUIRED);
        }

        return await prismaClient.user.findUnique({
            where: { username },
        });
    },

    getUsers: async (): Promise<User[]> => {
        return await prismaClient.user.findMany();
    },
};
