import { PRISMA_CLIENT } from '@/config';

export const USER_SERVICE = {
    deleteAllUsers: async () => {
        return await PRISMA_CLIENT.user.deleteMany();
    },

    getAllUsers: async () => {
        return await PRISMA_CLIENT.user.findMany();
    },

    getUserById: async (userId: number) => {
        return await PRISMA_CLIENT.user.findUnique({ where: { id: userId } });
    },

    getUserByEmail: async (email: string) => {
        return await PRISMA_CLIENT.user.findUnique({ where: { email } });
    },

    getUserByUsername: async (username: string) => {
        return await PRISMA_CLIENT.user.findUnique({ where: { username } });
    },
};
