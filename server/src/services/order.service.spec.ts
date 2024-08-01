// orderService.test.ts

import { orderService, detailedOrderQueryArgs } from './order.service';
import { prismaClient } from '@/database';
import { userService } from './user.service';
import { productService } from './product.service';
import createError from 'http-errors';
import { statusCodes, errorMessages } from '@/constants';
import { OrderStatus } from '@prisma/client';
import fetch from 'node-fetch';
import { env } from '@/config';

jest.mock('@/database', () => ({
    prismaClient: {
        order: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock('./user.service', () => ({
    userService: {
        getUserById: jest.fn(),
    },
}));

jest.mock('./product.service', () => ({
    productService: {
        getProduct: jest.fn(),
        getPackage: jest.fn(),
    },
}));

jest.mock('@/utils', () => ({
    generatePayPalAccessToken: jest.fn().mockResolvedValue('fake-access-token'),
}));

jest.mock('node-fetch', () => jest.fn());

describe('orderService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create an order and return it', async () => {
            const mockOrder = {
                id: 1,
                userId: 1,
                productId: 1,
                packageId: 1,
                quantity: 1,
                price: 100,
            };

            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            (productService.getProduct as jest.Mock).mockResolvedValue(true);
            (productService.getPackage as jest.Mock).mockResolvedValue(true);
            (prismaClient.order.create as jest.Mock).mockResolvedValue(mockOrder);
            (fetch as jest.Mock).mockResolvedValue({
                status: 201, // Ensure the status is either 200 or 201
                json: jest.fn().mockResolvedValue({ id: 'paypal-order-id' }),
            });
            (prismaClient.order.update as jest.Mock).mockResolvedValue(mockOrder);

            // Mock getOrder to return the mock order when called with the mockOrder ID
            (orderService.getOrder as jest.Mock).mockResolvedValue(mockOrder);
            (prismaClient.order.delete as jest.Mock).mockResolvedValue(mockOrder);

            const result = await orderService.createOrder(1, 1, 1, 1, 100, {});

            expect(prismaClient.order.create).toHaveBeenCalledWith({
                data: { userId: 1, productId: 1, packageId: 1, quantity: 1, price: 100 },
                ...detailedOrderQueryArgs,
            });
            expect(result).toEqual(mockOrder);
        });
        
        it('should throw an error if userId is not provided', async () => {
            await expect(
                orderService.createOrder(null as any, 1, 1, 1, 100, {})
            ).rejects.toThrow(createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID));
        });

        it('should throw an error if productId is not provided', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            await expect(
                orderService.createOrder(1, null as any, 1, 1, 100, {})
            ).rejects.toThrow(createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID));
        });

        it('should throw an error if packageId is not provided', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            (productService.getProduct as jest.Mock).mockResolvedValue(true);
            await expect(
                orderService.createOrder(1, 1, null as any, 1, 100, {})
            ).rejects.toThrow(createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID));
        });

        it('should throw an error if quantity is not provided', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            (productService.getProduct as jest.Mock).mockResolvedValue(true);
            (productService.getPackage as jest.Mock).mockResolvedValue(true);
            await expect(
                orderService.createOrder(1, 1, 1, null as any, 100, {})
            ).rejects.toThrow(createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID));
        });

        it('should throw an error if price is not provided', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            (productService.getProduct as jest.Mock).mockResolvedValue(true);
            (productService.getPackage as jest.Mock).mockResolvedValue(true);
            await expect(
                orderService.createOrder(1, 1, 1, 1, null as any, {})
            ).rejects.toThrow(createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRICE_INVALID));
        });

        
        
    });

    describe('getOrder', () => {
        it('should throw an error if orderId is not provided', async () => {
            await expect(orderService.getOrder(null as any)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID)
            );
        });

        it('should return the order if it exists', async () => {
            const mockOrder = { id: 1 };
            (prismaClient.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

            const result = await orderService.getOrder(1);

            expect(prismaClient.order.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, ...detailedOrderQueryArgs });
            expect(result).toEqual(mockOrder);
        });
    });

    describe('updateOrderStatus', () => {
        it('should throw an error if userId is not provided', async () => {
            await expect(orderService.updateOrderStatus(null as any, 1, 'CONFIRMED', new Date())).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID)
            );
        });

        it('should throw an error if orderId is not provided', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            await expect(orderService.updateOrderStatus(1, null as any, 'CONFIRMED', new Date())).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID)
            );
        });

        it('should throw an error if updatedStatus is invalid', async () => {
            (userService.getUserById as jest.Mock).mockResolvedValue(true);
            await expect(orderService.updateOrderStatus(1, 1, 'INVALID_STATUS' as any, new Date())).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_STATUS_INVALID)
            );
        });

        it('should update the order status and return the updated order', async () => {
            const mockOrder = { id: 1, status: 'CONFIRMED', confirmedAt: new Date() };
            (userService.getUserById as jest.Mock).mockResolvedValue({ id: 1, role: 'ADMIN' });
            (prismaClient.order.update as jest.Mock).mockResolvedValue(mockOrder);

            const result = await orderService.updateOrderStatus(1, 1, 'CONFIRMED', new Date());

            expect(prismaClient.order.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { status: 'CONFIRMED', confirmedAt: new Date() },
                ...detailedOrderQueryArgs,
            });
            expect(result).toEqual(mockOrder);
        });
    });

    describe('deleteOrder', () => {
        it('should throw an error if orderId is not provided', async () => {
            await expect(orderService.deleteOrder(null as any)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID)
            );
        });

        it('should delete the order and return it', async () => {
            const mockOrder = { id: 1 };
            (prismaClient.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
            (prismaClient.order.delete as jest.Mock).mockResolvedValue(mockOrder);

            const result = await orderService.deleteOrder(1);

            expect(prismaClient.order.delete).toHaveBeenCalledWith({ where: { id: 1 }, ...detailedOrderQueryArgs });
            expect(result).toEqual(mockOrder);
        });
    });
});
