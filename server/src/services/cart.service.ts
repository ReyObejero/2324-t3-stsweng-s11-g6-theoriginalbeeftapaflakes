import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { productService } from './product.service';

export type DetailedCart = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
                package: true;
            };
        };
    };
}>;

export type DetailedCartItem = Prisma.CartItemGetPayload<{
    include: {
        product: true;
        package: true;
    };
}>;

export const cartService = {
    createCart: async (userId: number): Promise<DetailedCart> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const existingCart = await cartService.getCart(userId);
        if (existingCart) {
            throw createError(statusCodes.clientError.CONFLICT, errorMessages.CART_ALREADY_EXISTS);
        }

        return await prismaClient.cart.create({
            data: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                        package: true,
                    },
                },
            },
        });
    },

    createCartItem: async (
        userId: number,
        productId: number,
        packageId: number,
        quantity: number,
    ): Promise<DetailedCartItem> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const product = await productService.getProduct(productId);
        if (!product) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const productPackage = await productService.getPackage(packageId);
        if (!productPackage) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        let cart = await cartService.getCart(userId);
        if (!cart) {
            cart = await cartService.createCart(userId);
        }

        const existingCartItem = await cartService.getCartItemByPackage(cart.id, productId, packageId);
        if (existingCartItem) {
            return await cartService.updateCartItem(existingCartItem.id, quantity);
        }

        return await prismaClient.cartItem.create({
            data: {
                cartId: cart?.id,
                productId,
                packageId,
                quantity,
                price: productPackage?.price,
            },
            include: {
                product: true,
                package: true,
            },
        });
    },

    getCart: async (userId: number): Promise<DetailedCart | null> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        return await prismaClient.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                        package: true,
                    },
                },
            },
        });
    },

    getCartItemById: async (cartItemId: number): Promise<DetailedCartItem | null> => {
        if (!cartItemId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        return await prismaClient.cartItem.findUnique({
            where: {
                id: cartItemId,
            },
            include: {
                product: true,
                package: true,
            },
        });
    },

    getCartItemByPackage: async (
        cartId: number,
        productId: number,
        packageId: number,
    ): Promise<DetailedCartItem | null> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        return await prismaClient.cartItem.findUnique({
            where: {
                cartId,
                productId,
                packageId,
            },
            include: {
                product: true,
                package: true,
            },
        });
    },

    getCarts: async (): Promise<DetailedCart[]> => {
        return await prismaClient.cart.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                        package: true,
                    },
                },
            },
        });
    },

    updateCartItem: async (cartItemId: number, quantity: number): Promise<DetailedCartItem> => {
        if (!cartItemId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        const cartItem = await cartService.getCartItemById(cartItemId);
        if (!cartItem) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        return await prismaClient.cartItem.update({
            where: { id: cartItemId },
            data: { quantity, price: cartItem.price + cartItem.package.price * quantity },
            include: { product: true, package: true },
        });
    },
};
