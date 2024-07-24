import { type Product } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';

export const productService = {
    getProductById: async (productId: number): Promise<Product | null> => {
        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_REQUIRED);
        }

        return await prismaClient.product.findUnique({
            where: { id: productId },
            include: {
                packages: {
                    include: {
                        items: {
                            include: {
                                flavor: true,
                                flavorVariant: true,
                            },
                        },
                    },
                },
            },
        });
    },

    getProducts: async (): Promise<Product[]> => {
        return await prismaClient.product.findMany({
            include: {
                packages: {
                    include: {
                        items: {
                            include: {
                                flavor: true,
                                flavorVariant: true,
                            },
                        },
                    },
                },
            },
        });
    },
};
