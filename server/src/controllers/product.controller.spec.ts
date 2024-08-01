import { Request, Response, NextFunction } from 'express';
import { productController } from '@/controllers/product.controller';
import { productService } from '@/services';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';

jest.mock('@/services/product.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));

describe('Product Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
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

    describe('getProduct', () => {
        it('should get a product', async () => {
            const product = { id: 1, name: 'Test Product' };
            req.params = { productId: '1' };

            (productService.getProduct as jest.Mock).mockResolvedValue(product);

            await productController.getProduct(req as Request, res as Response, next);

            expect(productService.getProduct).toHaveBeenCalledWith(1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: product });
        });
    });

    describe('getProducts', () => {
        it('should get all products', async () => {
            const products = [{ id: 1, name: 'Test Product' }];
            (productService.getProducts as jest.Mock).mockResolvedValue(products);

            await productController.getProducts(req as Request, res as Response, next);

            expect(productService.getProducts).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: products } });
        });
    });

    describe('deletePackage', () => {
        it('should delete a package from a product', async () => {
            const productPackage = { id: 1, productId: 1, packageId: 1 };
            req.params = { productId: '1', packageId: '1' };

            (productService.deletePackage as jest.Mock).mockResolvedValue(productPackage);

            await productController.deletePackage(req as Request, res as Response, next);

            expect(productService.deletePackage).toHaveBeenCalledWith(1, 1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: productPackage });
        });
    });
});
