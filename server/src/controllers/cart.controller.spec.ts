import { Request, Response, NextFunction } from 'express';
import { cartController } from '@/controllers/cart.controller';
import { cartService } from '@/services';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';

jest.mock('@/services/cart.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));


describe('Cart Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            jwtPayload: {
                userId: 1, // Ensure this is a number
                role: 'USER' // Add role property
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn() as NextFunction;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCartItem', () => {
        it('should create a cart item', async () => {
            const cartItem = { id: 1, productId: 1, packageId: 1, quantity: 1 };
            req.body = { productId: '1', packageId: '1', quantity: 1 };

            (cartService.createCartItem as jest.Mock).mockResolvedValue(cartItem);

            await cartController.createCartItem(req as Request, res as Response, next);

            expect(cartService.createCartItem).toHaveBeenCalledWith(1, 1, 1, 1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: cartItem });
        });
    });

    describe('getAuthenticatedUserCart', () => {
        it('should get the authenticated user cart', async () => {
            const cart = { items: [] };
            (cartService.getCartByUserId as jest.Mock).mockResolvedValue(cart);

            await cartController.getAuthenticatedUserCart(req as Request, res as Response, next);

            expect(cartService.getCartByUserId).toHaveBeenCalledWith(1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: cart });
        });
    });

    describe('getCarts', () => {
        it('should get all carts', async () => {
            const carts = [{ id: 1 }];
            (cartService.getCarts as jest.Mock).mockResolvedValue(carts);

            await cartController.getCarts(req as Request, res as Response, next);

            expect(cartService.getCarts).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: carts } });
        });
    });

    describe('updateCartItem', () => {
        it('should update a cart item', async () => {
            const cart = { id: 1, quantity: 2 };
            req.params = { cartItemId: '1' };
            req.body = { quantity: 2 };

            (cartService.updateCartItem as jest.Mock).mockResolvedValue(cart);

            await cartController.updateCartItem(req as Request, res as Response, next);

            expect(cartService.updateCartItem).toHaveBeenCalledWith(1, 2);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { cart } });
        });
    });

    describe('deleteCartItem', () => {
        it('should delete a cart item', async () => {
            const cartItem = { id: 1 };
            req.params = { cartItemId: '1' };

            (cartService.deleteCartItem as jest.Mock).mockResolvedValue(cartItem);

            await cartController.deleteCartItem(req as Request, res as Response, next);

            expect(cartService.deleteCartItem).toHaveBeenCalledWith(1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: cartItem });
        });
    });

    describe('deleteCarts', () => {
        it('should delete all carts', async () => {
            const carts = [{ id: 1 }];
            (cartService.deleteCarts as jest.Mock).mockResolvedValue(carts);

            await cartController.deleteCarts(req as Request, res as Response, next);

            expect(cartService.deleteCarts).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: carts } });
        });
    });
});
