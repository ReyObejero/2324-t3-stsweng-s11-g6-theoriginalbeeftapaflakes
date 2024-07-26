import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { cartService } from '@/services';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';

export const cartController = {
    createCartItem: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const { productId, packageId } = req.params;
        const cartItem = await cartService.createCartItem(
            req!.jwtPayload!.userId,
            Number(productId),
            Number(packageId),
            req.body.quantity,
        );

        return sendResponse(res, statusCodes.successful.OK, { data: cartItem });
    }),

    getAuthenticatedUserCart: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const cart = await cartService.getCart(req!.jwtPayload!.userId);

        return sendResponse(res, statusCodes.successful.OK, { data: cart });
    }),

    getCarts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const carts = await cartService.getCarts();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: carts } });
    }),
};
