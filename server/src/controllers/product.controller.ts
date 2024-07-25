import { type Request, type Response } from 'express';
import { statusCodes } from '@/constants';
import { asyncRequestHandlerWrapper, sendResponse } from '@/utils';
import { productService } from '@/services';

export const productController = {
    getProductById: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const product = await productService.getProductById(Number(req.params.productId));

        return sendResponse(res, statusCodes.successful.OK, { data: product });
    }),

    getProducts: asyncRequestHandlerWrapper(async (req: Request, res: Response): Promise<void> => {
        const products = await productService.getProducts();

        return sendResponse(res, statusCodes.successful.OK, { data: { items: products } });
    }),
};
