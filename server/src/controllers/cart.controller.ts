import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { cartService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const cartController = {
    handleCartItem: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { productId, packageId } = req.params;
        const cartItem = await cartService.handleCartItem(
            req!.jwtPayload!.userId,
            Number(productId),
            Number(packageId),
            req.body.quantity,
        );

        return sendResponse(res, statusCodes.successful.OK, { data: cartItem });
    }),

    getAuthenticatedUserCart: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const cart = await cartService.getCartByUserId(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: cart });
    }),

    getCarts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const carts = await cartService.getCarts();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: carts } });
    }),

    deleteCartItem: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { productId, packageId } = req.params;
        const cartItem = await cartService.deleteCartItem(req.body.cartId, Number(productId), Number(packageId));

        return sendResponse(res, statusCodes.successful.OK, { data: cartItem });
    }),

    deleteCarts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const carts = await cartService.deleteCarts();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: carts } });
    }),
};
