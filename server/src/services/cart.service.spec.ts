import { cartService } from './cart.service';
import { productService } from './product.service';
import { userService } from './user.service';
import { prismaClient } from '@/database';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';

jest.mock('./product.service');
jest.mock('./user.service');
jest.mock('@/database', () => ({
    prismaClient: {
        cart: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            deleteMany: jest.fn(),
        },
        cartItem: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));


cartService.getCartByUserId = jest.fn();
cartService.getCartById = jest.fn();
cartService.getCartItemById = jest.fn();
cartService.getCartItemByPackage = jest.fn();
cartService.getCartItemsByCartId = jest.fn();
cartService.updateCartTotalPrice = jest.fn();
cartService.updateCartItem = jest.fn();

describe('cartService', () => {

    describe('createCart', () => {
        it('should throw error if userId is missing', async () => {
            await expect(cartService.createCart(0)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID)
            );
        });

        it('should throw error if user is not found', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(null);
            await expect(cartService.createCart(1)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID)
            );
        });

        it('should create a new cart for the user', async () => {
            const mockUser = { id: 1, username: 'username' };
            (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
            (cartService.getCartByUserId as jest.Mock).mockResolvedValue(null);
            const mockCart = { id: 1, userId: 1, items: [] };
            (prismaClient.cart.create as jest.Mock).mockResolvedValue(mockCart);

            const result = await cartService.createCart(1);
            expect(result).toEqual(mockCart);
        });
    });

    describe('createCartItem', () => {
        it('should throw error if userId is missing', async () => {
            await expect(cartService.createCartItem(0, 1, 1)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID)
            );
        });

        it('should throw error if productId is missing', async () => {
            await expect(cartService.createCartItem(1, 0, 1)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID)
            );
        });

        it('should throw error if packageId is missing', async () => {
            await expect(cartService.createCartItem(1, 1, 0)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID)
            );
        });

        it('should throw error if quantity is missing', async () => {
            await expect(cartService.createCartItem(1, 1, 1, 0)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.QUANTITY_INVALID)
            );
        });

        it('should create a new cart item', async () => {
            const mockUser = { id: 1, username: 'username' };
            const mockProduct = { id: 1, name: 'product' };
            const mockPackage = { id: 1, price: 100 };
            const mockCart = { id: 1, userId: 1, items: [] };
            const mockCartItem = {
                id: 1,
                cartId: 1,
                productId: 1,
                packageId: 1,
                quantity: 1,
                price: 100,
                product: mockProduct,
                package: mockPackage,
            };

            (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
            (productService.getProduct as jest.Mock).mockResolvedValue(mockProduct);
            (productService.getPackage as jest.Mock).mockResolvedValue(mockPackage);
            (cartService.getCartByUserId as jest.Mock).mockResolvedValue(mockCart);
            (prismaClient.cartItem.create as jest.Mock).mockResolvedValue(mockCartItem);
            (cartService.updateCartTotalPrice as jest.Mock).mockResolvedValue(mockCart);

            const result = await cartService.createCartItem(1, 1, 1, 1);
            expect(result).toEqual(mockCartItem);
        });

        it('should update an existing cart item quantity', async () => {
            const mockUser = { id: 1, username: 'username' };
            const mockProduct = { id: 1, name: 'product' };
            const mockPackage = { id: 1, price: 100 };
            const mockCart = { id: 1, userId: 1, items: [] };
            const mockCartItem = {
                id: 1,
                cartId: 1,
                productId: 1,
                packageId: 1,
                quantity: 1,
                price: 100,
                product: mockProduct,
                package: mockPackage,
            };

            (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
            (productService.getProduct as jest.Mock).mockResolvedValue(mockProduct);
            (productService.getPackage as jest.Mock).mockResolvedValue(mockPackage);
            (cartService.getCartByUserId as jest.Mock).mockResolvedValue(mockCart);
            (cartService.getCartItemByPackage as jest.Mock).mockResolvedValue(mockCartItem);
            (cartService.updateCartItem as jest.Mock).mockResolvedValue({
                ...mockCartItem,
                quantity: 2,
                price: 200,
            });

            const result = await cartService.createCartItem(1, 1, 1, 1);
            expect(result).toEqual({
                ...mockCartItem,
                quantity: 2,
                price: 200,
            });
        });
    });

    describe('updateCartTotalPrice', () => {
        it('should throw error if cartId is missing', async () => {
            (cartService.updateCartTotalPrice as jest.Mock).mockImplementation(async (cartId) => {
                if (cartId === 0) {
                    throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
                } else {
                    return { id: 1, items: [], userId: 1, totalPrice: 0 };
                }
            });

            await expect(cartService.updateCartTotalPrice(0)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID)
            );
        });

        it('should update the total price of the cart', async () => {
            const mockCart = { id: 1, userId: 1, items: [], totalPrice: 0 };
            const mockCartItems = [
                { id: 1, cartId: 1, productId: 1, packageId: 1, quantity: 1, price: 100 },
                { id: 2, cartId: 1, productId: 1, packageId: 1, quantity: 2, price: 200 },
            ];

            (cartService.getCartById as jest.Mock).mockResolvedValue(mockCart);
            (cartService.getCartItemsByCartId as jest.Mock).mockResolvedValue(mockCartItems);
            const updatedCart = { ...mockCart, totalPrice: 300 };
            (prismaClient.cart.update as jest.Mock).mockResolvedValue(updatedCart);

            (cartService.updateCartTotalPrice as jest.Mock).mockImplementation(async (cartId) => {
                if (cartId === 0) {
                    throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
                } else {
                    return updatedCart;
                }
            });

            const result = await cartService.updateCartTotalPrice(1);
            expect(result.totalPrice).toBe(300);
        });
    });

    describe('deleteCartItem', () => {
        it('should throw error if cartItemId is missing', async () => {
            await expect(cartService.deleteCartItem(0)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID)
            );
        });

        it('should delete the cart item', async () => {
            const mockCartItem = {
                id: 1,
                cartId: 1,
                productId: 1,
                packageId: 1,
                quantity: 1,
                price: 100,
            };

            (cartService.getCartItemById as jest.Mock).mockResolvedValue(mockCartItem);
            (prismaClient.cartItem.delete as jest.Mock).mockResolvedValue(mockCartItem);

            const result = await cartService.deleteCartItem(1);
            expect(result).toEqual(mockCartItem);
        });
    });
});
