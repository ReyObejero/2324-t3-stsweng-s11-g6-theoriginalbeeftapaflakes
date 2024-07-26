import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { productService } from './product.service';
import { userService } from './user.service';

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

        const user = await userService.getUserById(userId);
        if (!user) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const existingCart = await cartService.getCartByUserId(userId);
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

    handleCartItem: async (
        userId: number,
        productId: number,
        packageId: number,
        quantity: number = 1,
    ): Promise<DetailedCartItem> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        if (quantity === null || quantity === undefined) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.QUANTITY_INVALID);
        }

        if (!(await userService.getUserById(userId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const productPackage = await productService.getPackage(packageId);
        if (!productPackage) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        let cart = await cartService.getCartByUserId(userId);
        if (!cart) {
            cart = await cartService.createCart(userId);
        }

        let existingCartItem = await cartService.getCartItemByPackage(cart.id, productId, packageId);
        if (!existingCartItem) {
            if (quantity <= 0) {
                throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.QUANTITY_INVALID);
            }

            const cartItem = await prismaClient.cartItem.create({
                data: {
                    cartId: cart?.id,
                    productId,
                    packageId,
                    quantity,
                    price: productPackage?.price * quantity,
                },
                include: {
                    product: true,
                    package: true,
                },
            });

            await cartService.updateCartTotalPrice(cart.id);

            return cartItem;
        } else {
            if (quantity != 0) {
                existingCartItem = await cartService.updateCartItem(existingCartItem.id, quantity);
                await cartService.updateCartTotalPrice(cart.id);

                return existingCartItem;
            } else {
                existingCartItem = await cartService.deleteCartItem(
                    existingCartItem.cartId,
                    existingCartItem.productId,
                    existingCartItem.packageId,
                );
                existingCartItem.quantity = 0;
                await cartService.updateCartTotalPrice(cart.id);

                return existingCartItem;
            }
        }
    },

    getCartById: async (cartId: number): Promise<DetailedCart | null> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        return await prismaClient.cart.findUnique({
            where: {
                id: cartId,
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

    getCartByUserId: async (userId: number): Promise<DetailedCart | null> => {
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

        return await prismaClient.cartItem.findFirst({
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

    getCartItemsByCartId: async (cartId: number): Promise<DetailedCartItem[]> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        return await prismaClient.cartItem.findMany({
            where: { cartId },
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

    updateCartTotalPrice: async (cartId: number): Promise<DetailedCart> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        const cartItems = await cartService.getCartItemsByCartId(cartId);

        const newTotalPrice = cartItems.reduce(
            (accumulator, currentCartItem) => accumulator + currentCartItem.price,
            0,
        );

        return await prismaClient.cart.update({
            where: { id: cartId },
            data: { totalPrice: newTotalPrice },
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

        const newQuantity = cartItem.quantity + quantity;

        return await prismaClient.cartItem.update({
            where: { id: cartItemId },
            data: {
                quantity: newQuantity,
                price: cartItem.package.price * newQuantity,
            },
            include: { product: true, package: true },
        });
    },

    deleteCartItem: async (cartId: number, productId: number, packageId: number): Promise<DetailedCartItem> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        if (!(await cartService.getCartById(cartId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        if (!(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        const cartItem = await cartService.getCartItemByPackage(cartId, productId, packageId);
        if (!cartItem) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }
        await prismaClient.cartItem.delete({ where: { id: cartItem.id } });

        return cartItem;
    },

    deleteCarts: async (): Promise<DetailedCart[]> => {
        const carts = await cartService.getCarts();
        await prismaClient.cart.deleteMany();

        return carts;
    },
};
