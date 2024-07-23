import createHttpError from 'http-errors';
import { JwtPayload } from 'jsonwebtoken';
import { statusCodes, validationStrings } from '@/constants';
import { prismaClient } from '@/database';
import { User } from '@/interfaces/entities';

export const userService = {
    getUserByEmail: async (email: string): Promise<User | null> => {
        return await prismaClient.user.findUnique({
            where: { email },
        });
    },

    getUserById: async (userId: number): Promise<User | null> => {
        return await prismaClient.user.findUnique({
            where: { id: userId },
        });
    },

    getUserByUsername: async (username: string): Promise<User | null> => {
        return await prismaClient.user.findUnique({
            where: { username },
        });
    },

    getUsers: async (): Promise<User[]> => {
        return await prismaClient.user.findMany();
    },
};
